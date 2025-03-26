
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CategoryId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const category = request.params['category']

    if (!category) {
      throw new BadRequestException('El parametro requerido no existe')
    }

    return category;

  },
);
