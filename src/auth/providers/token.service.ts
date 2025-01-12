import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { CookieService } from 'src/common/providers/cookie.service';
import { COOKIE_JWT_AGE, JWT_AGE } from 'src/constants/contants';
import { Users } from 'src/users/entity/users.entity';

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
    const payload = { role: user.role };
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  public send(res: Response, token: string): void {
    this.cookieService.send(res, 'access-token', token, COOKIE_JWT_AGE);
  }
}
