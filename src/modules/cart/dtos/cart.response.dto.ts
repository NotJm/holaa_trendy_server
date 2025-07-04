import { Expose, plainToInstance } from 'class-transformer';
import { CartItem } from '../entity/cart-item.entity';
import { Cart } from '../entity/cart.entity';
import { Product } from 'src/modules/products/entity/products.entity';

/**
 * DTO for sending the necessary data to the website
 */
export class CartResponseDto {
  @Expose()
  userName: string;

  @Expose()
  items: CartItemResposneDto[];
}

export class CartItemResposneDto {
  @Expose()
  product: Product;

  @Expose()
  quantity: number;

  @Expose()
  sizeName: string;

  @Expose()
  stock: number;
}

/**
 * Handle logic for creating CartResponseDto instance
 * @param cart An object cart that contain information about of the user's purchase
 * @returns A new instance CartResponseDto
 */
export const toCartResponseDto = (cart: Cart): CartResponseDto => {
  return plainToInstance(CartResponseDto, {
    items: cart.cartItems.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity,
        sizeName: item.variant.size.name,
        stock: item.variant.stock,
      };
    }),
  });
};
