import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BASE_BLOCK_DURATION,
  MAX_ATTEMPTS_IP_BAN,
  MAX_ATTEMPTS_NORMAL,
} from 'src/common/constants/contants';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base.service';
import {
  DAY_IN_MILLISECONDS,
  INCIDENTS_TYPE,
  INCIDENT_STATE,
  MAX_ATTEMPTS_STRONG,
} from '../../common/constants/contants';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { User } from '../users/entity/users.entity';
import { Incident } from './entity/user-incident.entity';

@Injectable()
export class IncidentService extends BaseService<Incident> {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly ipInfoService: IpInfoService,
  ) {
    super(incidentRepository);
  }

  /**
   * Handle logic for increasing the user's block duration on failed attempts
   * This method calculates and returns a progressively increased block duration for the user depending on the number of failed attempts recorded in their incident
   * @param failedAttempts The current number failed attempts the user has made, based on their incident record
   * @returns The calculated block duration, in milliseconds, to be assign to the user
   */
  private calculateBlockExpirationInMilliseconds(
    failedAttempts: number,
  ): number {
    if (failedAttempts >= MAX_ATTEMPTS_IP_BAN) {
      return 7 * DAY_IN_MILLISECONDS;
    }

    if (failedAttempts >= MAX_ATTEMPTS_STRONG) {
      return (failedAttempts - MAX_ATTEMPTS_STRONG) * DAY_IN_MILLISECONDS;
    }

    if (failedAttempts >= MAX_ATTEMPTS_NORMAL) {
      return BASE_BLOCK_DURATION * (failedAttempts - MAX_ATTEMPTS_NORMAL + 1);
    }
  }

  public generateSanction(failedAttempts: number): Date {
    const blockDuration =
      this.calculateBlockExpirationInMilliseconds(failedAttempts);

    return new Date(Date.now() + blockDuration);
  }

  /**
   * Handle logic for finds an incidente through unique identification
   * @param id An incident's unique identification
   * @returns A promise that resolve when successfully retrieves incident
   */
  private async findIncidentById(id: string): Promise<Incident> {
    const incident = await this.findById(id);

    if (!incident) {
      throw new ConflictException('Incidente de usuario no existe');
    }

    return incident;
  }

  /**
   * Verifies that the number of failed attempts has not exceeded the maximum attempts of allowed attempts
   * @param attemptsFailed The current number of failed attempts by the user
   * @param maxAttempts The maximum number of allowed attempts
   * @returns false if the number of failed attempts is less than or equal to the maximum attempts, true if it has been exceeded
   */
  private hasExceededMaxAttempts(
    attemptsFailed: number,
    maxAttempts: number,
  ): boolean {
    return attemptsFailed >= maxAttempts;
  }

  public async findIncidentByUser(user: User): Promise<Incident> {
    return await this.findOne({
      where: {
        user: user,
        resolutionDate: null,
      },
    });
  }

  public async getIncident(user: User): Promise<Incident> {
    return await this.findIncidentByUser(user);
  }

  /**
   * Handle logic for creating a user's incident
   * @param user - The user object containing the user's information
   * @param type - The type of the incident (e.g, login failed, mfa failed)
   * @param state - The current state of the incident (e.g, pending, under review)
   * @param description - A detail description of the incident
   * @param ip - The IP address asscioated with the incident, used to identify the user
   * @param userAgent - The user agent string representing the browser or client that was used
   * @returns A promise that resolves to the create incident object when the incident is successfully created
   */
  private async createOne(
    user: User,
    type: INCIDENTS_TYPE,
    state: INCIDENT_STATE,
    description: string,
    ip: string,
    userAgent: string,
  ): Promise<Incident> {
    try {
      const ipInformation = await this.ipInfoService.getInformation(ip);

      const incident = await this.create({
        user: user,
        type: type,
        description: description,
        state: state,
        ip: ip,
        geolocalization: ipInformation.loc,
        userAgent: userAgent,
        failedAttempts: 1,
      });

      return incident;
    } catch (err) {
      throw err;
    }
  }

  public async createOrUpdateIncident(
    user: User,
    type: INCIDENTS_TYPE,
    state: INCIDENT_STATE,
    description: string,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const incident = await this.getIncident(user);

    if (incident) {
      return await this.updateAttemptFailed(incident.id);
    }

    await this.createOne(user, type, state, description, ip, userAgent);
  }

  /**
   * Handles logic for updating the number of failed attempts for a user's incident
   * @param id The unique identifier representing the user's incident
   */
  async updateAttemptFailed(id: string): Promise<void> {
    const incident = await this.findIncidentById(id);

    incident.failedAttempts += 1;

    await this.repository.save(incident);
  }

  /**
   * Handles logic for updating the incident state for a user's incident
   * @param id The unique identifier representing the user's incident
   * @param state The current state of the incident (e.g, previe, under review)
   */
  async updateIncidentState(id: string, state: INCIDENT_STATE) {
    const incident = await this.findIncidentById(id);

    incident.state = state;

    this.repository.save(incident);
  }

  /**
   * Handles logic for marking the user's incident as resolves
   * @param id The unique identifier represting the user's incident
   */
  async markIncidentAsResolves(id: string) {
    const incident = await this.findIncidentById(id);

    incident.resolutionDate = new Date();

    this.repository.save(incident);
  }

  async checkAttemptsExceeded(id: string): Promise<boolean> {
    const incident = await this.findIncidentById(id);

    return this.hasExceededMaxAttempts(
      incident.failedAttempts,
      MAX_ATTEMPTS_NORMAL,
    );
  }
}
