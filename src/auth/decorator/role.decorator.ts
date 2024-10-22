/*
https://docs.nestjs.com/openapi/decorators#decorators
*/

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Role = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
