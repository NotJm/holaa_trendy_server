import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base.service';
import { LoggerApp } from '../../common/logger/logger.service';
import { ProductService } from '../products/product.service';
import { ProductVariantService } from '../products/providers/product-variant.service';
import { SizesService } from '../sizes/sizes.service';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AddProductToCartDto } from './dtos/add-product.cart.dto';
import { CartResponseDto, toCartResponseDto } from './dtos/cart.response.dto';
import { UpdateProductQuantityToCartDto } from './dtos/update-quantity.cart.dto';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService extends BaseService<Cart> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartIRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
    private readonly pvService: ProductVariantService,
    private readonly sizeService: SizesService,
    private readonly loggerApp: LoggerApp,
  ) {
    super(cartRepository);
  }

  private async findCartByIsActive(user: User): Promise<Cart> {
    const cart = await this.findOne({
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.variant',
        'cartItems.variant.size',
        'cartItems.variant.product',
      ],
      where: {
        user: user,
        isActive: true,
      },
    });

    if (cart) return cart;

    this.loggerApp.warn(
      `El usuario (${user.id}) no tiene asociado o no existe el carrito`,
      'CartService',
    );
    throw new NotFoundException(
      'El carrito del usuario no pudo ser recuperado',
    );
  }

  private async hasCart(user: User): Promise<boolean> {
    const cart = await this.findOne({
      relations: ['cartItems', 'cartItems.product'],
      where: {
        user: user,
        isActive: true,
      },
    });

    return !!cart;
  }

  private async createCart(user: User): Promise<Cart> {
    return this.create({
      user: user,
      isActive: true,
    });
  }

  private async getOrCreateCart(user: User): Promise<Cart> {
    const hasCart = await this.hasCart(user);

    if (hasCart) return await this.findCartByIsActive(user);

    return await this.createCart(user);
  }

  /**
   * Handles logic for getting the user's cart data
   * @param userId The unique user's id for searching user's data
   * @returns A Cart object that contain data
   */
  public async getCart(userId: string): Promise<CartResponseDto> {
    const user = await this.usersService.findUserById(userId);

    const cart = await this.findCartByIsActive(user);

    return toCartResponseDto(cart);
  }

  public async addProduct(
    userId: string,
    addProductToCartDto: AddProductToCartDto,
  ): Promise<CartResponseDto> {
    const { productCode, sizeName, quantity } = addProductToCartDto;

    const user = await this.usersService.findUserById(userId);

    const product = await this.productService.findProductByCode(productCode);

    const size = await this.sizeService.findSizeByName(sizeName);

    const variant = await this.pvService.findProductVariantByProductAndSize(
      product,
      size,
    );

    const cart = await this.getOrCreateCart(user);

    if (!cart.cartItems) {
      cart.cartItems = [];
    }

    let cartItem = cart.cartItems.find(
      (item) => item.product.code === productCode,
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartIRepository.create({
        cart,
        product: product,
        variant: variant,
        quantity,
      });

      cart.cartItems.push(cartItem);
    }

    await this.cartIRepository.save(cartItem);

    const userCart = await this.cartRepository.save(cart);

    return toCartResponseDto(userCart);
  }

  public async updateProductQuantity(
    userId: string,
    updateProductQuantityToCartDto: UpdateProductQuantityToCartDto,
  ): Promise<CartResponseDto> {
    const { productCode, sizeName, quantity } = updateProductQuantityToCartDto;

    const user = await this.usersService.findUserById(userId);

    const cart = await this.getOrCreateCart(user);

    if (!cart) {
      throw new NotFoundException(`User cart don't exists`);
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.code === productCode,
    );

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      throw new NotFoundException(
        `The product with code '${productCode}' don't exists in the cart`,
      );
    }

    await this.cartIRepository.save(cartItem);

    const userCart = await this.cartRepository.save(cart);

    return toCartResponseDto(userCart);
  }

  public async removeProductToCart(
    userId: string,
    productCode: string,
  ): Promise<CartResponseDto> {
    const user = await this.usersService.findUserById(userId);

    const cart = await this.findCartByIsActive(user);

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item.product.code === productCode,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException(
        `Producto con el código ${productCode} no se encontró en el carrito`,
      );
    }

    const cartItem = cart.cartItems[cartItemIndex];

    await this.cartIRepository.remove(cartItem);

    cart.cartItems.splice(cartItemIndex, 1);

    if (cart.cartItems.length === 0) {
      cart.isActive = false;
    }

    const userCart = await this.cartRepository.save(cart);

    return toCartResponseDto(userCart);
  }

  public async clearCart(userId: string): Promise<CartResponseDto> {
    const user = await this.usersService.findUserById(userId);

    const cart = await this.getOrCreateCart(user);

    await this.cartIRepository.delete({ cart: cart });

    cart.cartItems = [];

    const userCart = await this.cartRepository.save(cart);

    return toCartResponseDto(userCart);
  }
}
