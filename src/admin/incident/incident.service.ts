import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { BaseService } from '../../shared/base.service';
import { Incidents } from './entity/incidents.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { MAX_ATTEMPTS } from 'src/constants/contants';

@Injectable()
export class IncidentService extends BaseService<Incidents> {
  constructor(
    @InjectRepository(Incidents)
    private readonly incidentRepository: Repository<Incidents>,
  ) {
    super(incidentRepository);
  }

  async createIncident(data: Incidents): Promise<Incidents> {
    try {
      return await this.create(data);
    } catch (err) {
      throw err;
    }
  }

  async updateIncident(
    incidentId: string,
    data: Partial<Incidents>,
  ): Promise<Incidents> {
    try {
      return await this.update(incidentId, data);
    } catch (err) {
      throw err;
    }
  }

  async findIncident(user: Users): Promise<Incidents> {
    return await this.findOne({
      where: {
        user: user,
      },
    });
  }

  async findAllIncidents(): Promise<Incidents[]> {
    return await this.findAll();
  }

  async findAllIncidentsForUser(user: Users): Promise<Incidents[]> {
    return await this.repository.find({
      where: {
        user: user,
      },
      order: { createAt: 'DESC' },
      take: MAX_ATTEMPTS
    });
  }

  async countIncidentsForUser(user: Users): Promise<number> {
    return await this.repository.count({
      where: { user: user }
    })
  }

  async deleteIncident(user: string): Promise<void> {
    try {
      await this.delete({ where: { user: user } });
    } catch (err) {
      throw err;
    }
  }
}
