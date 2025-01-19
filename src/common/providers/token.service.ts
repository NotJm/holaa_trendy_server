import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { COOKIE_JWT_AGE, JWT_AGE } from 'src/common/constants/contants';
import { CookieService } from 'src/common/providers/cookie.service';
import { Users } from 'src/users/entity/users.entity';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {

  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: JWT_AGE,
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  public generate(user: Users): string {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  public send(res: Response, token: string): void {
    this.cookieService.send(res, 'accessToken', token, COOKIE_JWT_AGE);
  }

  public verify(accessToken: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(accessToken);
    } catch (err) {
      throw new Error("Token Invalido")
    }
  }
}
