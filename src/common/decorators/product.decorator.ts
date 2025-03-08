
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProductCode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const productCode = request.params['productCode']

    if (!productCode) {
      throw new BadRequestException('El parametro requerido no existe')
    }

    return productCode;

  },
);
