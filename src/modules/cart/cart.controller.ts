import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { CartService } from './cart.service';
import { AddProductToCartDto } from './dtos/add-product.cart.dto';
import { Cart } from './entity/cart.entity';
import { UpdateProductQuantityToCartDto } from './dtos/update-quantity.cart.dto';
import { RemoveProducToCartDto } from './dtos/remove-product.cart.dto';
import { ApiResponse } from '../../common/interfaces/api.response.interface';
import { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROLE } from '../../common/constants/contants';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.USER)
export class CartController extends BaseController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post('add')
  async addProductToCart(
    @User() userId: string,
    @Body() addProductToCartDto: AddProductToCartDto,
  ): Promise<ApiResponse> {
    try {
      const cart = await this.cartService.addProductToCart(
        userId,
        addProductToCartDto
      );

      return {
        status: HttpStatus.OK,
        message: 'Se ha agregado el producto exitosamente',
        data: cart,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  async getCart(@User() userId: string): Promise<Cart> {
    return await this.cartService.getCart(userId);
  }

  @Put('update/quantity')
  async updateProductQuantityToCart(
    @User() userId: string,
    @Body() updateProductQuantityToCartDto: UpdateProductQuantityToCartDto,
  ): Promise<ApiResponse> {
    try {
      const updateCart = await this.cartService.updateProductQuantity(
        userId,
        updateProductQuantityToCartDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Cantidad del producto actualizado exitosamente',
        data: updateCart,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete('remove/:productCode')
  async removeProducToCart(
    @User() userId: string,
    @Param('productCode') productCode: string,
  ): Promise<ApiResponse> {
    try {
      const cart = await this.cartService.removeProductToCart(
        userId,
        productCode,
      );

      return {
        status: HttpStatus.OK,
        message: 'Producto removido del carrito exitosamente',
        data: cart,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
