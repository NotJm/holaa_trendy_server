import {
  BadRequestException,
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
  ACCOUNT_STATE,
  INCIDENT_STATE,
  INCIDENTS_TYPE,
  MAX_ATTEMPTS_IP_BAN,
  MAX_ATTEMPTS_STRONG,
} from '../../common/constants/contants';
import { IApiResponse } from '../../common/interfaces/api.response.interface';
import { LoggerApp } from '../../common/logger/logger.service';
import { CookieService } from '../../common/providers/cookie.service';
import { PwnedService } from '../../common/providers/pwned.service';
import { RegisterAddressDto } from './dtos/register-address.dto';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { formattedDate } from 'src/common/utils/formatted-date';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly pwnedService: PwnedService,
    private readonly incidentService: IncidentService,
    private readonly cookieService: CookieService,
    private readonly loggerApp: LoggerApp,
  ) {
    super(userRepository);
  }

  /**
   * Handles logic for recovering the user's IP address and the header 'user-agent' from the request
   * This method extracts the client's IP address and the header 'user-agent' from the request headers or connection details
   * @param req The HTTP Request object containing the user's request details, including headers and connection info
   * @returns The user's IP address and the header 'user-agent' if found; otherwise it returns 'undefine' or 'null' if the IP cannot be determined
   */
  public recoverUserIpAndUserAgent(req: Request): {
    ip: string;
    userAgent: string;
  } {
    const forwardedIp = req.headers['x-forwarded-for'];
    const userAgent = req.get('user-agent');

    if (!Array.isArray(forwardedIp)) {
      return {
        ip: forwardedIp || req.socket.remoteAddress,
        userAgent,
      };
    }

    return {
      ip: forwardedIp[0],
      userAgent,
    };
  }

  /**
   * Metodo que perimite encontrar un usuario por medio del ID
   * @param id ID del Usuario
   * @returns Usuario encontrado
   */
  async findUserById(id: string): Promise<User> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * Handles the logic of finding an user by their user's email
   * @param email The username of the user to search for
   * @returns A promise that resolves to the user object if found, or null if no user matches the provide username
   * @throws {NotFoundException} Throws an exception if the user cannot be found
   */
  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email: email } });
  }

  /**
   * Handles logic of finding an user through user's username
   * @param username The user's username
   * @returns A promise that resolves when the user successfully found
   * @throws {NotFoundException} Throws an exception if the user cannot be found
   */
  async findUserByUsername(username: string): Promise<User> {
    return await this.findOne({ where: { username: username } });
  }

  private async findUserByUsernameAndEmail(
    username: string,
    email: string,
  ): Promise<User> {
    return await this.findOne({
      where: [{ username: username }, { email: email }],
    });
  }

  /**
   * Metodo que permite encontrar a todos los usuarios
   * @returns Lista de Usuarios
   */
  async findAllUsers(): Promise<User[]> {
    return await this.findAll();
  }

  async isUserExists(username: string, email: string): Promise<void> {
    const user = await this.findUserByUsernameAndEmail(username, email);

    if (user) {
      this.loggerApp.warn(
        `Intento de registro fallido: la cuenta del usuario ya existe`,
        'AuthService',
      );

      throw new ConflictException('El usuario ya se encuentra registrado');
    }
  }

  /**
   * Handles the logic for creating an user
   * @param data An user object containing all user information
   * @returns An promise that resolves to the user object if successfully created
   * @throws {Error} Throws a error exception if the user cannot be created
   */
  async createUser(data: User): Promise<User> {
    try {
      return this.create(data);
    } catch (error) {
      throw new Error(`Error al momento de crear usuario: ${error.message}`);
    }
  }

  /**
   * Marks as actived the user's account
   * @param userId An unique identifier for searching to the user
   */
  async markUserAsActive(userId: string): Promise<void> {
    await this.updateOne(userId, {
      accountState: ACCOUNT_STATE.ACTIVED,
    });
  }

  /**
   * Handles the logic for updating state of a user's account
   * This method updates the user's account state to a specified value (e.g, ACTIVATED, DESACTIVED, SUSPENDED, BLOCKED) from the user's account
   * @param userId The user's unique identifier used to locate the user's data in the data base
   * @param state The new state of the user's account (e.g, ACTIVATED, DESACTIVED, SUSPENDED, BLOCKED)
   */
  async updateAccountState(
    userId: string,
    state: ACCOUNT_STATE,
  ): Promise<void> {
    await this.updateOne(userId, {
      accountState: state,
    });
  }

  /**
   * Handles the logic for updating the user's block expiration
   * This method updastes the user's block expiration depending on the number of failed attempts recorded their incident
   * @param userId The user's unique identifier used to locate the user's data in the data base
   * @param blockExpire The expiration date of the block, in format ISO, defining the duration for which the user's account remains blocked
   */
  async setBlockExpiration(userId: string, expiresAt: Date): Promise<void> {
    await this.updateOne(userId, {
      blockExpiresAt: expiresAt,
    });
  }

  /**
   * Metodo que permite actualizar un usuario existente
   * @param userId ID del Usuario
   * @param data Datos del usuario a actualizar
   * @returns Usuario actualizado
   */
  async updateOne(userId: string, data: Partial<User>): Promise<User> {
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
  async isPasswordCommitted(password: string): Promise<void> {
    const isCommitted = await this.pwnedService.isPwned(password);

    if (isCommitted) {
      this.loggerApp.warn(
        `Contraseña comprometida: el usuario intento registrarse con una contraseña ${password}`,
        'UserService',
      );
      throw new BadRequestException(
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
  ): Promise<IApiResponse> {
    const accessToken = this.cookieService.get(req, 'accessToken');

    // const { id } = await this.tokenService.verify(accessToken);

    // await this.updateUser(id, {
    //   addressId: {
    //     ...registerAddressDto,
    //   },
    // });

    return {
      status: HttpStatus.OK,
      message: 'Se ha registrado con exito la direccion',
    };
  }

  async registerIncident(
    user: User,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    return this.incidentService.createOrUpdateIncident(
      user,
      INCIDENTS_TYPE.LOGIN_FAILED,
      INCIDENT_STATE.PENDING,
      'Intento de inicio de sesion fallido: Contraseñas no coinciden',
      ip,
      userAgent,
    );
  }

  async isUserLocked(user: User): Promise<void> {
    if (
      user.blockExpiresAt instanceof Date &&
      new Date(user.blockExpiresAt).getTime() > new Date().getTime()
    ) {
      this.loggerApp.warn(
        'Intento de iniciar sesion: el usuario intento iniciar sesion pero su cuenta se encontraba bloqueada',
        'AuthService',
      );
      throw new ConflictException(
        `Usuario con cuenta bloqueada, se desbloqueara ${formattedDate(user.blockExpiresAt)}`,
      );
    }
  }

  async blockUser(user: User): Promise<void> {
    const incident = await this.incidentService.getIncident(user);

    const failedAttempts = incident.failedAttempts;

    if (incident.failedAttempts >= MAX_ATTEMPTS_IP_BAN) {
      return await this.suspendedAccount(user.id, failedAttempts);
    }

    const blockExpiresAt =
      this.incidentService.generateSanction(failedAttempts);

    await this.setBlockExpiration(user.id, blockExpiresAt);
  }

  /**
   * Handles the logic for suspending the user's account
   * This method suspends the user's account for 7 days based on the number of failed attempts
   * @param userId The user's unique identifier used to locate user's data in the data base
   * @param failedAttempts The current number failed attempts that triggred the suspension, resulting in a 7-day sanction
   */
  public async suspendedAccount(
    userId: string,
    failedAttempts: number,
  ): Promise<void> {
    const sanctionExpiresAt =
      this.incidentService.generateSanction(failedAttempts);

    await this.updateAccountState(userId, ACCOUNT_STATE.SUSPENDED);

    await this.setBlockExpiration(userId, sanctionExpiresAt);
  }

  async isUserAccoundActived(user: User): Promise<void> {
    if (user.accountState !== ACCOUNT_STATE.ACTIVED) {
      this.loggerApp.warn(
        'Intento de iniciar sesion: El usuario intento iniciar sesion pero su cuenta no est activada',
        'UserService',
      );
      throw new ConflictException('Cuenta no activada');
    }
  }

  async checkAttemptsExceeded(user: User): Promise<boolean> {
    const incident = await this.incidentService.getIncident(user);

    return await this.incidentService.checkAttemptsExceeded(incident.id);

  }
}
