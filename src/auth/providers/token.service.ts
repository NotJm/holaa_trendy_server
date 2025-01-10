import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { CookieService } from 'src/common/providers/cookie.service';
import { COOKIE_JWT_AGE, JWT_AGE } from 'src/constants/contants';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class TokenService {

  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: JWT_AGE,
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  public generate(user: User): string {
    const payload = { sessionID: user.sessionId, role: user.role };
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  public send(res: Response, token: string): void {
    this.cookieService.send(res, 'authToken', token, COOKIE_JWT_AGE);
  }
}
