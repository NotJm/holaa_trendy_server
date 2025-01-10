import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  Req,
  Res,
  NotFoundException,
  UnauthorizedException,
  Type,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PwnedService } from '../common/providers/pwned.service';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AccountVerificationDto } from './dtos/activation.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { OtpService } from '../common/providers/otp.service';
import { IncidentService } from '../admin/incident/incident.service';
import { Request, Response } from 'express';
import {
  COOKIE_JWT_AGE,
  JWT_AGE,
  COOKIE_DEFAULT_AGE,
} from '../constants/contants';
import { EmailService } from 'src/admin/email/email.service';
import { UsersService } from '../users/users.service';
import { BaseService } from 'src/shared/base.service';

@Injectable()
export class AuthService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly user_model: Model<UserDocument>,
    private readonly jwt_service: JwtService,
    private readonly user_service: UsersService,
    private readonly incident_service: IncidentService,
    private readonly email_service: EmailService,
    private readonly pwned_service: PwnedService,
    private readonly otp_service: OtpService,
  ) {
    super();
    this.model = this.user_model;
  }

  /**
   * Se asegura que el usuario este verificado
   * @param user Objeto de tipo User
   */
  private ensure_user_is_verified(user: User): void {
    if (!user.is_verified) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message:
          'Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios.',
      });
    }
  }

  /**
   * Asegura que el usuario no este bloqueado
   * @param {string} username Nombre de usuario
   */
  private async ensure_account_is_not_blocked(username: string): Promise<void> {
    const inicdent_user =
      await this.incident_service.get_incident_user(username);

    if (inicdent_user && inicdent_user.isBlocked) {
      const un_block_time = new Date(
        inicdent_user.blockExpiresAt,
      ).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${un_block_time}.`,
      });
    }
  }

  /**
   * Metodo que crea un token tipo JWT
   * @param user Objeto de tipo User
   * @returns Devuelve un token tipo JWT
   */
  private create_jwt_token(user: User): string {
    const payload = { role: user.role };
    return this.jwt_service.sign(payload, { expiresIn: JWT_AGE });
  }

  /**
   * Metodo que verifica si la contraseña del usuario ha sido comprometida
   * @param password Contraseña del usuario
   */
  private async is_password_compromised(password: string): Promise<void> {
    const times_committed =
      await this.pwned_service.verificationPassword(password);

    if (times_committed > 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: `La contraseña ya fue comprometida ${times_committed} veces`,
      });
    }
  }

  /**
   * Metodo que verifica que el codigo OTP sea valido
   * @param otp codigo OTP
   */
  private ensure_valid_otp(otp: string): void {
    const is_valid = this.otp_service.verify_otp(otp);

    if (!is_valid) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'El código es inválido',
      });
    }
  }

  /**
   * Metodo que se encarga de cambiar la contraseña de un usuario
   * @param user Objeto de tipo UserDocument
   * @param new_password Nueva contraseña del usuario
   */
  private async change_password(
    user: UserDocument,
    new_password: string,
  ): Promise<void> {
    await this.user_model
      .updateOne({ _id: user._id }, { password: new_password })
      .exec();
  }

  /**
   * Metodo que activa la cuenta del usuario
   * @param user Objeto de tipo UserDocument
   */
  private async set_account_active(user: UserDocument): Promise<void> {
    await user.updateOne({ is_verified: true }).exec();
  }

  /**
   * Metodo para registrar a un usuario en la base de datos
   * @param signup_dto
   * @returns Regresa el codigo de la respuesta a si como el mensaje de la peticion
   */
  async signup(
    signup_dto: SignUpDto,
    @Res() res: Response,
  ): Promise<{ status: number; message: string }> {
    const { username, password, email } = signup_dto;

    const exists_user = await this.find_one({
      username: username,
      email: email,
    });

    if (exists_user) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `El usuario "${username}" ya tiene una cuenta registrada`,
      });
    }

    await this.is_password_compromised(password);

    const hashed_password = await bcrypt.hash(password, 10);

    const new_user = new this.model({
      username: username,
      password: hashed_password,
      email: email,
      permissions: ['change_password'],
    });

    this.create(new_user)

    await this.otp_service.set_otp_for_user(new_user);

    await this.email_service.send_code_verification(
      email,
      new_user.otp,
      new_user.otp_expiration,
    );

    res.cookie('verification', 'signup', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/',
      maxAge: COOKIE_DEFAULT_AGE,
    });

    return {
      status: HttpStatus.OK,
      message: `Gracias por registrarse ${username}, hemos enviado un codigo de activación de cuenta a su correo`,
    };
  }

  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  async login(
    loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<{ status: number; message: string }> {
    const { username, password } = loginDto;

    const exists_user = await this.user_service.find_user_by_field({
      username: username,
    });

    if (!exists_user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario "${username}" no se encuentra registrado, Por favor registrese`,
      });
    }

    this.ensure_user_is_verified(exists_user);

    await this.ensure_account_is_not_blocked(username);

    const is_password_matching = await bcrypt.compare(
      password,
      exists_user.password,
    );

    if (!is_password_matching) {
      await this.incident_service.registerFailedAttempt({ username });

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Nombre de usuario o contraseña incorrecta',
      });
    }

    const sessionId = uuidv4();
    await exists_user.updateOne({ session_id: sessionId }).exec();
    const token = this.create_jwt_token(exists_user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: COOKIE_JWT_AGE,
      path: '/',
    });

    res.cookie('verification', 'login', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/',
      maxAge: COOKIE_DEFAULT_AGE,
    });

    await this.otp_service.set_otp_for_user(exists_user);

    await this.email_service.send_code_verification(
      exists_user.email,
      exists_user.otp,
      exists_user.otp_expiration,
    );

    return {
      status: HttpStatus.OK,
      message: `Bienvenido ${exists_user.username}, necesitamos que verfique que es usted, se ha enviado un codigo a su correo electronico asociado`,
    };
  }

  /**
   * Metodo para cerrar la sesion de un usuario
   * @param res
   * @returns
   */
  async logout(res: Response): Promise<void> {
    res.clearCookie('jwt', {
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.status(HttpStatus.ACCEPTED).json({
      status: HttpStatus.ACCEPTED,
      message: 'Sesion cerrada exitosamente',
    });
  }

  /**
   * Metodo para obtener el estado de la verificacion
   * @param req Peticion donde contiene la cookies
   * @returns Regresa el estado de la verificacion
   */
  async verification_status(@Req() req: Request): Promise<{ status: number }> {
    const verification_cookie = req.cookies.verification;

    if (!verification_cookie) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Proceso no autorizado',
      });
    }

    return { status: HttpStatus.OK };
  }

  /**
   * Metodo que se encarga de verificar la cuenta del usuario
   * @param accountVerificationDto
   * @param res
   * @returns
   */
  async account_verification(
    accountVerificationDto: AccountVerificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<{ status: number; message: string; route: string }> {
    const { otp } = accountVerificationDto;

    const process = req.cookies.verification;

    const processRoute = new Map<string, string>([
      ['login', '/auth'],
      ['signup', '/login'],
      ['forgot_password', '/reset-password'],
    ]);

    const route = processRoute.get(process);

    this.ensure_valid_otp(otp);

    const user_selected = await this.user_service.find_user_by_field({
      otp: otp,
    });

    await this.set_account_active(user_selected);

    await this.otp_service.delete_otp_from_user(user_selected);

    await user_selected.save();

    res.clearCookie('verification');

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado con exito la cuenta',
      route: route,
    };
  }

  async forgot_password_status(
    @Req() req: Request,
  ): Promise<{ status: number }> {
    const forgot_password_cookie = req.cookies.forgot_password;

    if (!forgot_password_cookie) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Proceso no autorizado',
      });
    }

    return { status: HttpStatus.OK };
  }

  /**
   * Metodo para poder iniciar el proceso de "Olvide Contraseña"
   * @param forgotPasswordDto
   * @param res
   * @returns
   */
  async forgot_password(
    forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ): Promise<{ status: number; message: string }> {
    const { email } = forgotPasswordDto;

    const exists_user = await this.user_service.find_user_by_field({
      email: email,
    });

    await this.otp_service.set_otp_for_user(exists_user);

    await this.email_service.send_code_verification(
      exists_user.email,
      exists_user.otp,
      exists_user.otp_expiration,
    );

    res.cookie('verification', 'forgot_password', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/',
      maxAge: COOKIE_DEFAULT_AGE,
    });

    res.cookie('forgot_password', 'pending', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/',
      maxAge: COOKIE_DEFAULT_AGE,
    });

    return {
      status: HttpStatus.OK,
      message:
        'Se ha enviado un código OTP a su correo para recuperar la contraseña',
    };
  }

  /**
   * Metodo para poder restablecer la contraseña del usuario
   * @param resetPasswordDto
   * @param res
   * @returns
   */
  async reset_password(
    resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<{ status: number; message: string }> {
    const { email, new_password: password } = resetPasswordDto;

    const exists_user = await this.user_service.find_user_by_field({
      email: email,
    });

    const hashed_password = await bcrypt.hash(password, 10);

    await this.change_password(exists_user, hashed_password);

    res.clearCookie('forgot_password');

    return {
      status: HttpStatus.OK,
      message: 'Contraseña actualizada exitosamente',
    };
  }
}
