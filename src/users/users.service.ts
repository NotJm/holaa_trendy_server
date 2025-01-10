import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { IncidentService } from '../admin/incident/incident.service';
import { PwnedService } from '../common/providers/pwned.service';
import { formattedDate } from '../shared/utils/formatted-date';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

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
    const user = await this.findOne(filter);

    if (!user) {
      throw new InternalServerErrorException('Usuario no encontrado');
    }

    return user;
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
      await this.delete(userId);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de eliminar el usuario: ${err.message}`,
      );
    }
  }

  async registerFailedAttempt(userId: string): Promise<void> {
    const incidentUser =
      await this.incidentService.createOrUpdateIncident(userId);

    const hasReachedFailedAttemptsLimit = true
      // await this.incidentService.checkFailedAttemptsLimit(incidentUser);

    if (hasReachedFailedAttemptsLimit) {
      const user = await this.blockUser(userId);

      throw new ConflictException(
        `Su cuenta ha sido bloqueada. Se desbloqueará automáticamente el ${formattedDate(user.blockExpiresAt)}.`,
      );
    }
  }

  async blockUser(userId: string): Promise<Users> {
    const blockDuration = 15 * 60 * 1000;

    const blockExpiresAt = new Date(Date.now() + blockDuration);

    return await this.updateUser(userId, {
      isBlocked: true,
      blockExpiresAt: blockExpiresAt,
    });
  }

  async userIsBlocked(userId: string): Promise<void> {
    const user = await this.findUserById(userId);

    console.log(
      user.isBlocked &&
        user.blockExpiresAt instanceof Date &&
        user.blockExpiresAt < new Date(),
    );

    const shouldBeUnBlocked = await this.checkIfUserShouldBeUnblocked(user);

    if (shouldBeUnBlocked) {
      await this.updateUser(userId, {
        isBlocked: false,
        blockExpiresAt: null,
      });

      const incidentUser = await this.incidentService.findIncident(userId);

      // await this.incidentService.resetFailedAttempts(incidentUser);
    } else if (user.isBlocked) {
      throw new ConflictException(
        `Su cuenta esta bloqueada, Se desbloqueara automaticamente el ${formattedDate(user.blockExpiresAt)}`,
      );
    } else {
      return;
    }
  }

  async userIsVerified(userId: string): Promise<void> {
    const user = await this.findUserById(userId);

    if (!user.isVerified) {
      throw new ConflictException(
        'Por favor, active su cuenta para habilitar el acceso a los servicios.',
      );
    }
  }

  /**
   * Metodo que verifica si un usuario debe de ser desbloqueado
   * @param userId ID del usuario
   * @returns
   */
  checkIfUserShouldBeUnblocked(user: Users): boolean {
    if (!user.isBlocked) {
      return false;
    }

    if (!(user.blockExpiresAt instanceof Date)) {
      return false;
    }

    return user.blockExpiresAt < new Date();
  }
}
