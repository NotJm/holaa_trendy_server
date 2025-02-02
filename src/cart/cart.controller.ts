import { Controller, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @Post(':userId/items')
  // addToCart(
  //   @Param('userId') userId: string,
  //   @Body() 
  // )

}
