import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { CartService } from './cart.service';
import { AddProductToCartDto } from './dtos/add-product.cart.dto';
import { Cart } from './entity/cart.entity';
import { UpdateProductQuantityToCartDto } from './dtos/update-quantity.cart.dto';
import { RemoveProducToCartDto } from './dtos/remove-product.cart.dto';
import { ApiResponse } from '../../common/interfaces/api.response.interface';

@Controller('cart')
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Roles(ROLE.USER)
export class CartController extends BaseController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post('add')
  async addProductToCart(
    @Body() addProductToCartDto: AddProductToCartDto,
  ): Promise<ApiResponse> {
    try {
      const cart = await this.cartService.addProductToCart(addProductToCartDto);

      return {
        status: HttpStatus.OK,
        message: 'Se ha agregado el producto exitosamente',
        data: cart,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string): Promise<Cart> {
    return await this.cartService.getCart(userId);
  }

  @Put('update/quantity')
  async updateProductQuantityToCart(
    @Body() updateProductQuantityToCartDto: UpdateProductQuantityToCartDto,
  ): Promise<ApiResponse> {
    try {
      const updateCart = await this.cartService.updateProductQuantity(
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

  @Delete('remove/product')
  async removeProducToCart(
    @Body() removeProducToCartDto: RemoveProducToCartDto
  ): Promise<ApiResponse> {
    try {
      const cart = await this.cartService.removeProductToCart(removeProducToCartDto)

      return {
        status: HttpStatus.OK,
        message: 'Producto removido del carrito exitosamente',
        data: cart
      }

    } catch (error) {
      return this.handleError(error);
    }
  }
}
