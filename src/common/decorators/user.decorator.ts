import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;


    if (!user) { 
      throw new Error("Usuario no encotrado en la peticion")
    }

    return user.userId;
  },
);
