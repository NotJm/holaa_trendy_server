import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseService } from 'src/common/base.service';
import { Argon2Service } from 'src/common/providers/argon2.service';
import { formattedDate } from 'src/common/utils/formatted-date';
import { Repository } from 'typeorm';
import {
  ACCOUNT_STATE,
  INCIDENT_STATE,
  INCIDENTS_TYPE,
  MAX_ATTEMPTS_IP_BAN,
} from '../../common/constants/contants';
import { IApiResponse } from '../../common/interfaces/api.response.interface';
import { LoggerApp } from '../../common/logger/logger.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { CookieService } from '../../common/providers/cookie.service';
import {
  ProfileResponseDto,
  toProfileResponseDto,
} from './dtos/profile.response.dto';
import { RegisterAddressDto } from './dtos/register-address.dto';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { Address } from './entity/user-address.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly pwnedService: PwnedService,
    private readonly incidentService: IncidentService,
    private readonly cookieService: CookieService,
    private readonly argon2Service: Argon2Service,
    private readonly loggerApp: LoggerApp,
  ) {
    super(userRepository);
  }

  /**
   * Handles logic for recovering the user's IP address and the header 'user-agent' from the request
   * @summary This method extracts the client's IP address and the header 'user-agent' from the request headers or connection details
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

  private async hasAddress(user: User): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: {
        user: user,
      },
    });

    return address;
  }

  /**
   * Metodo que perimite encontrar un usuario por medio del ID
   * @param id ID del Usuario
   * @returns Usuario encontrado
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.findOne({
      relations: ['address'],
      where: {
        id: id,
      },
    });

    if (!user) {
      this.loggerApp.warn(
        'Intento de obtener un usuario que no existe',
        'UserService',
      );
      throw new NotFoundException('Su cuenta no se pudo encontrar');
    }

    return user;
  }

  async findUserByPhone(phone: string): Promise<User> {
    return await this.findOne({ where: { phone: phone } });
  }

  /**
   * Handles the logic of finding an user by their user's email
   * @param email The username of the user to search for
   * @returns A promise that resolves to the user object if found, or null if no user matches the provide username
   * @throws {NotFoundException} Throws an exception if the user cannot be found
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email: email } });

    if (!user) {
      this.loggerApp.warn(
        'Intento de envio de enlace de verificacion: El usuario no existe',
        'AuthService',
      );
      throw new ConflictException(
        'Su cuenta asociada no se encuentra registrada',
      );
    }

    return user;
  }

  /**
   * Handles logic of finding an user through user's username
   * @param username The user's username
   * @returns A promise that resolves when the user successfully found
   * @throws {NotFoundException} Throws an exception if the user cannot be found
   */
  async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({ where: { username: username } });

    if (!user) {
      this.loggerApp.warn(
        'Intento de inciar sesion: el usuario intento inciar sesion con unas credenciales incorrectas',
        'UserService',
      );
      throw new ConflictException(
        '¡Ups! Parece que los datos no coinciden. Verifica tu correo o contraseña.',
      );
    }

    return user;
  }
  private async findUserByUsernameAndEmailAndPhone(
    username: string,
    email: string,
    phone: string,
  ): Promise<User> {
    return await this.findOne({
      where: [{ username: username }, { email: email }, { phone: phone }],
    });
  }

  /**
   * Metodo que permite encontrar a todos los usuarios
   * @returns Lista de Usuarios
   */
  async findAllUsers(): Promise<User[]> {
    return await this.findAll();
  }

  async isUserExists(
    username: string,
    email: string,
    phone: string,
  ): Promise<boolean> {
    const user = await this.findUserByUsernameAndEmailAndPhone(
      username,
      email,
      phone,
    );

    return !!user;
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

  async hashPassword(password: string): Promise<string> {
    return await this.argon2Service.hash(password);
  }

  async verifyPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await this.argon2Service.compare(hashPassword, password);
  }

  async getUserData(
    userId: string,
  ): Promise<{ username: string; email: string; avatar: string }> {
    const user = await this.findUserById(userId);

    if (!user) {
      this.loggerApp.warn(
        'Intento de obtener el avatar de un usuario que no existe',
        'UserService',
      );
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      username: user.username,
      email: user.email,
      avatar: `https://ui-avatars.com/api/?name=${user.username}`,
    };
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return toProfileResponseDto(user);
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
  async setBlockExpiration(userId: string, expiresAt: Date): Promise<User> {
    return await this.updateOne(userId, {
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

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.updateOne(userId, {
      password: password,
    });
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
    userId: string,
    registerAddressDto: RegisterAddressDto,
  ): Promise<ProfileResponseDto> {
    const user = await this.findUserById(userId);

    let address = await this.hasAddress(user);

    // Si no existe, crear la nueva dirección
    if (!address) {
      address = this.addressRepository.create(registerAddressDto); // Crear la nueva dirección
      address = await this.addressRepository.save(address); // Guardarla en la base de datos
    } else {
      // Si existe, actualizar la dirección
      address = Object.assign(address, registerAddressDto); // Actualizar los datos de la dirección
      address = await this.addressRepository.save(address); // Guardarla nuevamente
    }

    // Actualizar el usuario con la nueva dirección (en caso de que se haya creado una nueva)
    user.address = address;
    const updatedUser = await this.userRepository.save(user); // Guardar los cambios en el usuario

    return toProfileResponseDto(updatedUser); // Devolver la respuesta
  }

  async getAddress(userId: string): Promise<ProfileResponseDto> {
    const user = await this.findUserById(userId);

    return toProfileResponseDto(user);
  }

  /**
   * Handles the logic for registering an incident
   * @summary This method registers an incident for a user by creating or updating an incident record in the database
   * @param user The user object
   * @param ip The IP address of the user
   * @param userAgent The user agent of the user
   */
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
        `Desafortunadamente su cuenta esta bloqueada, se desbloqueara el dia ${formattedDate(user.blockExpiresAt)}`,
      );
    }
  }

  /**
   * Handle the logic for blocking a user's account
   * This method block a user's account if the user's failed attempts exceeded the limit
   * @param user The user object
   * @returns The user object
   */
  async blockUser(user: User): Promise<User> {
    const incident = await this.incidentService.getIncident(user);

    const failedAttempts = incident.failedAttempts;

    if (incident.failedAttempts >= MAX_ATTEMPTS_IP_BAN) {
      await this.suspendedAccount(user.id, failedAttempts);

      this.loggerApp.warn(
        'Cuenta suspendida: el usuario intento multiples veces iniciar sesion con unas credenciales incorrectas',
        'UserService',
      );
      throw new ConflictException(
        'Su cuenta ha sido temporalmente suspendida por alcanzar el limite de intentos',
      );
    }

    const blockExpiresAt =
      this.incidentService.generateSanction(failedAttempts);

    const userBlocked = await this.setBlockExpiration(user.id, blockExpiresAt);

    this.loggerApp.warn(
      'Cuenta bloqueada: La cuenta del usuario ha sido bloqueada temporalmente por alcanzar el limite de intentos',
      'UserService',
    );

    throw new ConflictException(
      `Desafortunadamente su cuenta esta bloqueada, se desbloqueara el dia ${formattedDate(userBlocked.blockExpiresAt)}`,
    );
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
  ): Promise<User> {
    const sanctionExpiresAt =
      this.incidentService.generateSanction(failedAttempts);

    await this.updateAccountState(userId, ACCOUNT_STATE.SUSPENDED);

    return await this.setBlockExpiration(userId, sanctionExpiresAt);
  }

  /**
   * Handles the logic for checking if a user's account is active
   * @summary This method checks if a user's account is active by verifying the user's account state
   * @param user The user object
   */
  async isUserAccountActived(user: User): Promise<void> {
    if (user.accountState !== ACCOUNT_STATE.ACTIVED) {
      this.loggerApp.warn(
        'Intento de inicio de sesion: El usuario intento iniciar sesion pero su cuenta no esta activada',
        'AuthService',
      );

      throw new ConflictException(
        'Tu cuenta aún no está activada. Por favor, verifica tu correo o contáctanos para más información.',
      );
    }
  }

  /**
   * Handles the logic for checking if a user's account has exceeded the number of attempts
   * @summary This method checks if a user's account has exceeded the number of attempts by verifying the user's failed attempts
   * If the user's failed attempts are exceeded, the user's account will be blocked
   * @param user The user object
   */
  async checkAttemptsExceeded(user: User): Promise<void> {
    const incident = await this.incidentService.getIncident(user);

    const hasExceeded = await this.incidentService.checkAttemptsExceeded(
      incident.id,
    );

    if (!hasExceeded) {
      this.loggerApp.warn(
        'Intento de inicio de sesion: El usuario no introducio la contraseña correcta',
        'AuthService',
      );

      throw new ConflictException('Nombre de usuario o contraseña incorrecta');
    }

    await this.blockUser(user);
  }
}
