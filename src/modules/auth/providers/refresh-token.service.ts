import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { LessThan, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import {
    COOKIE_REFRESH_JWT_AGE,
    REFRESH_JWT_AGE,
} from '../../../common/constants/contants';
import { CookieService } from '../../../common/providers/cookie.service';
import { User } from '../../../modules/users/entity/users.entity';
import { RefreshToken } from '../entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService extends BaseService<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {
    super(refreshTokenRepository);
  }

  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: REFRESH_JWT_AGE,
  };

  private findRefreshTokenByToken(token: string): Promise<RefreshToken> {
    return this.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  private findRefreshTokenByUserId(userId: string): Promise<RefreshToken> {
    return this.findOne({
      where: { user: {
        id: userId
      } },
      relations: ['user'],
    });
  }

  public generate(user: User): string {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload, this.jwtOptions);
  }

  public send(res: Response, token: string): void {
    this.cookieService.send(
      res,
      'refreshAccessToken',
      token,
      COOKIE_REFRESH_JWT_AGE,
    );
  }

  public async createOne(
    user: User,
    ip: string,
    userAgent: string,
  ): Promise<string> {
    const token = this.generate(user);
    const expiresAt = new Date(Date.now() + COOKIE_REFRESH_JWT_AGE * 1000);

    await this.create({
      user: user,
      token: token,
      expiresAt: expiresAt,
      ipAddress: ip,
      deviceInfo: userAgent,
    });

    return token;

  }

  async verify(token: string): Promise<User> {
    const payload = this.jwtService.verify(token);
    const refreshToken = await this.findRefreshTokenByToken(token);

    if (
      !refreshToken ||
      refreshToken.revoked ||
      refreshToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return refreshToken.user;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.findRefreshTokenByToken(token);
    await this.update(refreshToken.id, {
      token: token,
      revoked: true,
    });
  }

  async revokeAllUserRefreshToken(user: User): Promise<void> {
    const refresToken = await this.findRefreshTokenByUserId(user.id);
    await this.update(refresToken.id, {
      user: user,
      revoked: true,
    })
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(now),
    })
  }

}
