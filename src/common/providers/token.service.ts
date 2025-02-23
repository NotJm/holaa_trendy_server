import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { COOKIE_JWT_AGE, JWT_AGE } from 'src/common/constants/contants';
import { CookieService } from 'src/common/providers/cookie.service';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';
import { User } from '../../modules/users/entity/users.entity';

@Injectable()
export class TokenService {

  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: JWT_AGE,
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  public generate(user: User, secret: string): string {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload, { secret: secret, ...this.jwtOptions});
  }

  public send(res: Response, token: string): void {
    this.cookieService.send(res, 'accessToken', token, COOKIE_JWT_AGE);
  }

  public verify(token: string, secret: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token, { secret: secret });
    } catch (err) {
      throw new UnauthorizedException(`Invalid Token, reason ${err.message}`)
    }
  }

  public decode(token: string): JwtPayload {
    const decode = this.jwtService.decode<JwtPayload>(token);

    if (!decode) {
      throw new UnauthorizedException("Invalid Token");
    }

    return decode;

  }
}
