import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MAX_ATTEMPTS } from 'src/common/constants/contants';
import { User } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base.service';
import { Incidents } from './entity/incidents.entity';

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

  async findIncident(user: User): Promise<Incidents> {
    return await this.findOne({
      where: {
        user: user,
      },
    });
  }

  async findAllIncidents(): Promise<Incidents[]> {
    return await this.findAll();
  }

  async findAllIncidentsForUser(user: User): Promise<Incidents[]> {
    return await this.repository.find({
      where: {
        user: user,
      },
      order: { createAt: 'DESC' },
      take: MAX_ATTEMPTS
    });
  }

  async countIncidentsForUser(user: User): Promise<number> {
    return await this.repository.count({
      where: { user: user }
    })
  }

  async deleteIncident(user: User): Promise<void> {
    try {
      await this.delete({ where: { user: user } });
    } catch (err) {
      throw err;
    }
  }


}
