import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/shared/base.service';
import { FindOneOptions, Repository } from 'typeorm';
import { IncidentService } from '../admin/incident/incident.service';
import { PwnedService } from '../common/providers/pwned.service';
import { BLOCK_DURATION, LOCK_TIME_MINUTES, MAX_ATTEMPTS } from '../constants/contants';
import { Users } from './entity/users.entity';

@Injectable()
export class UsersService extends BaseService<Users> {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly pwnedService: PwnedService,
    private readonly incidentService: IncidentService,
  ) {
    super(userRepository);
  }

  async isPasswordPwned(password: string): Promise<void> {
    const isCompromised = await this.pwnedService.isPwned(password);

    if (isCompromised) {
      throw new ConflictException(
        'La contraseña esta comprometida. Eliga otra',
      );
    }
  }

  async findUser(filter: FindOneOptions<Users>): Promise<Users> {
    return await this.findOne(filter);
  }

  async findUserById(userId: string): Promise<Users> {
    const user = await this.findById(userId);

    if (!user) {
      throw 'Usuario no encontrado';
    }

    return user;
  }

  async findAllUsers(): Promise<Users[]> {
    const user = await this.findAll();

    if (user) {
      throw 'No existe ningun registro de usuarios';
    }

    return user;
  }

  async createUser(data: Users): Promise<Users> {
    try {
      return this.create(data);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de crear usuario: ${err.message}`
      )
    }
    
  }

  async updateUser(
    userId: string,
    item: Partial<Users>,
  ): Promise<Users> {
    try {
      return this.update(userId, item);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de acualizar el usuario: ${err.message}`,
      );
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.deleteById(userId);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de eliminar el usuario: ${err.message}`,
      );
    }
  }

  async registerIncident(user: Users): Promise<void> {
    
    await this.incidentService.createIncident({
      description: 'Intento fallido de inicio de sesion',
      user: user,
    })

    const incidentCount = await this.incidentService.countIncidentsForUser(user);

    if (incidentCount >= MAX_ATTEMPTS) {
      this.updateUser(user.id, {
        isBlocked: true,
        blockExpiresAt: new Date(Date.now() + BLOCK_DURATION)
      })
    }

  }

  async isUserLocked(user: Users): Promise<boolean> {
    const now = new Date();

    const recetIncidents = await this.incidentService.findAllIncidentsForUser(user);

    if (recetIncidents.length >= MAX_ATTEMPTS) {
      const lastAttemptTime = new Date(recetIncidents[0].createAt);
      const lockExpiration = new Date(lastAttemptTime.getTime() + LOCK_TIME_MINUTES * 60000);
      return lockExpiration > now;
    }

    return false;

  } 

  async blockUser(userId: string): Promise<Users> {
    const blockExpiresAt = new Date(Date.now() + BLOCK_DURATION);

    return await this.updateUser(userId, {
      isBlocked: true,
      blockExpiresAt: blockExpiresAt,
    });
  }



  async userIsVerified(userId: string): Promise<void> {
    const user = await this.findUserById(userId);

    if (!user.isVerified) {
      throw new ConflictException(
        'Por favor, active su cuenta para habilitar el acceso a los servicios.',
      );
    }
  }

}
