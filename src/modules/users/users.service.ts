import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseService } from 'src/common/base.service';
import { FindOneOptions, Repository } from 'typeorm';
import {
  BLOCK_DURATION,
  LOCK_TIME_MINUTES,
  MAX_ATTEMPTS,
} from '../../common/constants/contants';
import { ApiResponse } from '../../common/interfaces/api.response.interface';
import { CookieService } from '../../common/providers/cookie.service';
import { PwnedService } from '../../common/providers/pwned.service';
import { TokenService } from '../../common/providers/token.service';
import { RegisterAddressDto } from './dtos/register-address.dto';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly pwnedService: PwnedService,
    private readonly incidentService: IncidentService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
  ) {
    super(userRepository);
  }

  /**
   * Permite encontrar un usuario con especificaciones
   * @param filter filtro de busqueda
   * @returns Usuario encontrado
   */
  async findUser(filter: FindOneOptions<User>): Promise<User> {
    return await this.findOne(filter);
  }

  /**
   * Metodo que perimite encontrar un usuario por medio del ID
   * @param id ID del Usuario
   * @returns Usuario encontrado
   */
  async findUserById(id: string): Promise<User> {
    return await this.findOne({
      where: {
        userId: id
      }
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email: email } })
  }

  /**
   * Metodo que permite encontrar a todos los usuarios
   * @returns Lista de Usuarios
   */
  async findAllUsers(): Promise<User[]> {
    return await this.findAll();
  }

  /**
   * Metodo que permite crear un usuario
   * @param data Datos del usuario
   * @returns Regresa el usuario creado
   */
  async createUser(data: User): Promise<User> {
    try {
      return this.create(data);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de crear usuario: ${err.message}`,
      );
    }
  }

  /**
   * Metodo que permite actualizar un usuario existente
   * @param userId ID del Usuario
   * @param data Datos del usuario a actualizar
   * @returns Usuario actualizado
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      return this.update(userId, data);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de acualizar el usuario: ${err.message}`,
      );
    }
  }

  /**
   * Metodo que permite eliminar un usuario
   * @param userId ID del usuario
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.deleteById(userId);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de eliminar el usuario: ${err.message}`,
      );
    }
  }

  /**
   * Verifica si una contraseña esta pwned (comprometida)
   * @param password Contraseña del usuario
   */
  async isPasswordPwned(password: string): Promise<void> {
    const isCompromised = await this.pwnedService.isPwned(password);

    if (isCompromised) {
      throw new ConflictException(
        'La contraseña esta comprometida. Eliga otra',
      );
    }
  }



  /**
   * Metodo para registrar o actualizar la direccion de un usuario
   * @param req Cuerpo de la peticion
   * @param registerAddressDto Direccion de un usuario
   * @returns Promsesa con dos indicativos
   */
  async registerAddress(
    req: Request,
    registerAddressDto: RegisterAddressDto,
  ): Promise<ApiResponse> {
    const accessToken = this.cookieService.get(req, 'accessToken');

    const { id } = await this.tokenService.verify(accessToken);

    await this.updateUser(id, {
      addressId: {
        ...registerAddressDto,
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Se ha registrado con exito la direccion',
    };
  }

  async registerIncident(user: User): Promise<void> {
    await this.incidentService.createIncident({
      description: 'Intento fallido de inicio de sesion',
      user: user,
    });

    const incidentCount =
      await this.incidentService.countIncidentsForUser(user);

    if (incidentCount >= MAX_ATTEMPTS) {
      this.blockUser(user.userId);
    }
  }

  async isUserLocked(user: User): Promise<boolean> {
    const now = new Date();

    const recetIncidents =
      await this.incidentService.findAllIncidentsForUser(user);

    if (recetIncidents.length >= MAX_ATTEMPTS) {
      const lastAttemptTime = new Date(recetIncidents[0].createAt);
      const lockExpiration = new Date(
        lastAttemptTime.getTime() + LOCK_TIME_MINUTES * 60000,
      );
      return lockExpiration > now;
    }

    return false;
  }

  async blockUser(userId: string): Promise<User> {
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
