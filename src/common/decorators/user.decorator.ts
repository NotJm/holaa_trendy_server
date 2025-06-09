import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IApiRequest } from '../interfaces/api-request.interface';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IApiRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Su sesion ha expirado o es invalida');
    }

    return user.userId;
  },
);
