import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  COOKIE_BY_ROLE,
  JWT_BY_ROLE,
  JWT_DEFAULT_AGE_AS_NUMBER,
  REFRESH_THRESHOLD,
  ROLE,
} from '../../common/constants/contants';
import { LoggerApp } from '../../common/logger/logger.service';
import { RedisService } from '../../common/microservice/redis.service';
import { TokenService } from '../../common/providers/token.service';
import { generateExpirationDate } from '../../common/utils/generate-expiration-date';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AccountActivationService } from './providers/account-activation.service';
import { EmailVerificationService } from './providers/email-verification.service';
import { RefreshTokenService } from './providers/refresh-token.service';
import { SessionService } from './providers/session.service';
import { SMSVerificationService } from './providers/sms-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accountActivationService: AccountActivationService,
    private readonly smsVerificationService: SMSVerificationService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  private hasSessionExceededThreshold(
    expirationInMiliseconds: number,
  ): boolean {
    const currentTime = Date.now();

    const sessionDuration = expirationInMiliseconds - currentTime;

    return sessionDuration < REFRESH_THRESHOLD;
  }

  /**
   * Handle the logic for user registration.
   * Validates input data, hashes the password, and create a new user in the database
   * @param signUpDto DTO contains user registration details
   * @returns A promise thant resolve when the user is created sucessfully
   */
  async signUp(signUpDto: SignUpDto, res: Response): Promise<void> {
    const { username, password, email, phone } = signUpDto;

    if (await this.usersService.isUserExists(username, email, phone)) {
      this.loggerApp.warn(
        `Intento de registro fallido: la cuenta del usuario ya existe`,
        'AuthService',
      );

      throw new ConflictException(
        'Este correo ya está asociado a una cuenta. ¿Olvidaste tu contraseña?',
      );
    }

    await this.usersService.isPasswordCommitted(password);

    const hashedPassword = await this.usersService.hashPassword(password);

    const newUser = await this.usersService.createUser({
      username: username,
      password: hashedPassword,
      email: email,
      phone: phone,
    });

    const token = this.tokenService.generate({ userId: newUser.id });

    await this.redisService.set(`verify:${token}`, { userId: newUser.id }, 600);

    const expiresAt = generateExpirationDate(JWT_DEFAULT_AGE_AS_NUMBER);

    return await this.accountActivationService.send(
      username,
      email,
      token,
      expiresAt,
    );
  }

  /**
   * Handles the logic for user account activation
   * @param userId Unique Identification of the user
   * @returns A promise that resolves when user account is successfully activated
   */
  async activateAccount(token: string): Promise<void> {
    return await this.accountActivationService.activate(token);
  }

  /**
   * Handles the logic for user authentication.
   * @param loginDto The DTO containing the user's credentials (username and password).
   * @param res The response object to send back to the client.
   * @returns The response to the client, including a JWT cookie for authentication.
   */
  async logIn(
    loginDto: LoginDto,
    res: Response,
    req: Request,
  ): Promise<string> {
    const { username, password } = loginDto;

    const { ip, userAgent } = this.usersService.recoverUserIpAndUserAgent(req);

    const user = await this.usersService.findUserByUsername(username);

    await this.usersService.isUserLocked(user);

    const isPasswordMatching = await this.usersService.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      await this.usersService.registerIncident(user, ip, userAgent);

      await this.usersService.checkAttemptsExceeded(user);
    }

    await this.usersService.isUserAccountActived(user);

    const token = this.tokenService.generate({ userId: user.id });

    const expiresAt = generateExpirationDate(JWT_DEFAULT_AGE_AS_NUMBER);

    await this.emailVerificationService.send(
      user.username,
      user.email,
      expiresAt,
      token,
    );

    return user.role;
  }

  async startSession(token: string, res: Response): Promise<void> {
    return await this.sessionService.start(token, res);
  }

  /**
   * Handles the logic for logging out a user
   * @param res Response to the client
   * @param req Request from the client
   * @returns Response to the client
   */
  async logout(res: Response, req: Request): Promise<void> {
    const { accessToken, refreshToken } = this.tokenService.get(req);

    if (!accessToken || !refreshToken) {
      this.loggerApp.warn(
        'Intento de cerrar la sesion del usuario: El usuario no esta autenticado',
        'AuthService',
      );

      throw new UnauthorizedException('Su token es invalido o expiro');
    }
    await this.redisService.del(`refresh:${refreshToken}`);

    this.tokenService.delete(res, 'trendy_session');
    this.tokenService.delete(res, 'trendy_refresh_session');
  }

  async sendSms(phone: string): Promise<void> {
    return await this.smsVerificationService.send(phone);
  }

  async verifySms(phone: string, code: string, res: Response): Promise<void> {
    return await this.smsVerificationService.verify(phone, code, res);
  }

  async sendRecoveryLink(email: string, res: Response): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);

    const sessionId = await this.sessionService.generateTemporarySession(
      user.id,
    );

    this.sessionService.send(sessionId, res);

    const expiresAt = generateExpirationDate(JWT_DEFAULT_AGE_AS_NUMBER);

    return await this.emailVerificationService.send(
      user.username,
      email,
      expiresAt,
      undefined,
      false,
    );
  }

  /**
   * Metodo que permite restablecer y finalizar la recuperacion de contraseña
   * @param resetPasswordDto
   * @returns
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    req: Request,
    res: Response,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;

    const sessionId = this.sessionService.verify(req);

    const userId = await this.sessionService.get(sessionId);

    const user = await this.usersService.findUserById(userId);

    if (!user) {
      this.loggerApp.warn(
        'Intento de restablecer contraseña: El usuario no existe',
        'AuthService',
      );

      throw new ConflictException(
        'No encontramos un usuario con esa informacion',
      );
    }

    const hashedNewPassword = await this.usersService.hashPassword(newPassword);

    await this.usersService.updatePassword(user.id, hashedNewPassword);

    return await this.sessionService.del(sessionId, res);
  }

  async checkSession(
    req: Request,
    res: Response,
  ): Promise<{ active: boolean; role: ROLE }> {
    const { accessToken, refreshToken } = this.tokenService.get(req);

    const userData = await this.tokenService.verify<JwtPayload>(accessToken);

    const user = await this.usersService.findUserById(userData.id);

    return { active: true, role: user.role };
  }

  async refreshToken(req: Request, res: Response): Promise<boolean> {
    const { accessToken, refreshToken } = this.tokenService.get(req);

    if (!refreshToken) {
      this.loggerApp.warn(
        'Intento de actualizar el refres tokende: El refresh token no existe',
        'AuthService',
      );

      throw new UnauthorizedException('Su token es invalido o expiro');
    }

    const refreshTokenData = await this.redisService.get<{ userId: string }>(
      `refresh:${refreshToken}`,
    );

    if (!refreshTokenData) {
      this.loggerApp.warn(
        'Intento de actualizar el token de acceso: Los datos no existen',
        'AuthService',
      );

      throw new UnauthorizedException('Su token es invalido o expiro');
    }

    const { userId } = refreshTokenData;

    const user = await this.usersService.findUserById(userId);

    const jwtAge = JWT_BY_ROLE[user.role];

    const newJwt = this.tokenService.generate(
      { id: user.id, role: user.role },
      jwtAge,
    );

    this.tokenService.send(
      newJwt,
      res,
      'trendy_session',
      COOKIE_BY_ROLE[user.role],
    );

    return true;
  }
}
