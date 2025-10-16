import { ConflictException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiRequest } from 'src/common/interfaces/api-request.interface';
import { ROLE } from '../../common/constants/contants';
import { LoggerApp } from '../../common/logger/logger.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AccountActivationService } from './providers/account-activation.service';
import { RefreshTokenService } from './providers/refresh-token.service';
import { SessionService } from './providers/session.service';
import { VerificationService } from './providers/verification.service';
import { ISession } from './interfaces/session.interface';
import { TokenService } from './providers/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly verificationService: VerificationService,
    private readonly accountActivationService: AccountActivationService,
  ) {}

  /**
   * Handle the logic for user registration.
   * @summary Validates input data, hashes the password, and create a new user in the database
   * @param signUpDto DTO contains user registration details
   * @returns A promise thant resolve when the user is created sucessfully
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password, email, phone } = signUpDto;

    if (await this.usersService.isUserExists(username, email, phone)) {
      this.loggerApp.warn(
        `Intento de registro de usuario: El usuario esta asociado a una cuenta`,
        'AuthService',
      );

      throw new ConflictException(
        'El nombre de usuario esta asociado a una cuenta. ¿Olvido su contraseña?',
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

    const { token, expiresAt } = await this.accountActivationService.generate(
      newUser.id,
    );

    return await this.accountActivationService.send(
      username,
      email,
      token,
      expiresAt,
    );
  }

  /**
   * Handles the logic for the user's authentication
   * @param loginDto A DTO that containing the user's credentials
   * @param res A response object
   * @param useVerficiationSession A flag for controller if the user should verify him session after of login
   * @returns A promise that resolves when the users successfully login
   */
  async logIn(
    loginDto: LoginDto,
    res: Response,
    req: IApiRequest,
    useVerficiationSession: boolean = false,
  ): Promise<void> {
    const { username, password } = loginDto;

    const { ip, userAgent } = this.usersService.recoverUserIpAndUserAgent(req);

    const user = await this.usersService.findUserByUsername(username);

    await this.usersService.isUserLocked(user);

    const isPasswordMatching = await this.usersService.isPasswordMatch(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      await this.usersService.registerIncident(user, ip, userAgent);

      await this.usersService.checkAttemptsExceeded(user);
    }

    await this.usersService.isUserAccountActived(user);

    if (!useVerficiationSession) {
      return await this.sessionService.startSession(user, res);
    }

    return await this.verificationService.byVerificationLink(user);
  }

  async mobileLogIn(
    loginDto: LoginDto,
    res: Response,
    req: IApiRequest,
  ): Promise<{ token: string; }> {
    const { username, password } = loginDto;

    const { ip, userAgent } = this.usersService.recoverUserIpAndUserAgent(req);

    const user = await this.usersService.findUserByUsername(username);

    await this.usersService.isUserLocked(user);

    const isPasswordMatching = await this.usersService.isPasswordMatch(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      await this.usersService.registerIncident(user, ip, userAgent);

      await this.usersService.checkAttemptsExceeded(user);
    }

    await this.usersService.isUserAccountActived(user);

    const token = this.tokenService.generateToken(
      { userId: user.id, role: ROLE.USER },
      '3h'
    );

    return { token };

  }

  /**
   * Handles the logic for starting a session
   * @summary This method is used to start a session for a user
   * @param token - An unique token to identify the session
   * @param res - The response object to send back to the client
   * @returns A promise that resolves when the session is started
   * @throws UnauthorizedException if the token is invalid or expired
   */
  async startSession(
    token: string,
    res: Response,
    useVerficiationAccount: boolean = false,
  ): Promise<void> {
    if (!useVerficiationAccount) return;

    return await this.sessionService.startSession(null, res, token, true);
  }

  /**
   * Handles the logic for logging out a user
   * @summary This method is user to log out a user
   * @param res Response to the client
   * @param req Request from the client
   * @returns A promise that resolves when the user is logged out
   * @throws UnauthorizedException if the refresh token is invalid or expired
   */
  async logout(res: Response, req: IApiRequest): Promise<void> {
    this.sessionService.stopSession(res, req);
  }

  /**
   * Handles the logic for reseting the user's password
   * @param resetPasswordDto A DTO that containing the user's new password
   * @returns A promise that don't resolves nothing
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    req: Request,
    res: Response,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;

    const sessionId = this.sessionService.verifySession(req);

    const userId = await this.sessionService.get(sessionId);

    const user = await this.usersService.findUserById(userId);

    const hashedNewPassword = await this.usersService.hashPassword(newPassword);

    await this.usersService.updatePassword(user.id, hashedNewPassword);

    return await this.sessionService.del(sessionId, res);
  }

  /**
   * Handles the logic for checking the user's session
   * @param req A request object
   * @returns A promise that resolves ISession containing the user's role
   */
  async checkSession(req: IApiRequest): Promise<ISession> {
    return await this.sessionService.checkSession(req);
  }

  /**
   * Handles the logic for refreshing the user's token
   * @param req A request object
   * @param res A response object
   * @returns A promise that don't resolves notihng
   */
  async refreshToken(req: IApiRequest, res: Response): Promise<void> {
    return await this.refreshTokenService.refreshTokenWithRedis(req, res);
  }

  /**
   * Handles the logic for user account activation
   * @summary This method is used to activate a user account
   * @param token The unique token to activate the user account
   * @returns A promise that resolves when user account is successfully activated
   */
  async activateAccount(token: string): Promise<void> {
    return await this.accountActivationService.activate(token);
  }

  /**
   * Handles the logic for sending sms code to the user
   * @param phone The user's phone
   * @returns A promise that resolves when user successfully recived sms code
   */
  async sendSMS(phone: string): Promise<void> {
    return await this.verificationService.sendSMS(phone);
  }

  /**
   * Handles the logic for verifying sms code to the user
   * @param phone The user's phone
   * @param code The unique OTP code identification
   * @param res The response object
   * @returns A promise that resolves when user successfully verified sms code
   */
  async verifySMS(phone: string, code: string, res: Response): Promise<void> {
    const user = await this.usersService.findUserByPhone(phone);

    const sessionId = await this.sessionService.generateTemporarySession(
      user.id,
    );

    this.sessionService.sendSessionInCookie(sessionId, res);

    return await this.verificationService.verifySMS(phone, code);
  }

  /**
   * Handles the logic for sending recovery link to the user
   * @param email The user's email
   * @param res A response object
   * @returns A primise that don't resolves nothing
   */
  async sendRecoveryLink(email: string, res: Response): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);

    const sessionId = await this.sessionService.generateTemporarySession(
      user.id,
    );

    this.sessionService.sendSessionInCookie(sessionId, res);

    return await this.verificationService.byEmail(user);
  }
}
