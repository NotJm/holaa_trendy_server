import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base.service';
import { ProductService } from '../products/product.service';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AddProductToCartDto } from './dtos/add-product.cart.dto';
import { UpdateProductQuantityToCartDto } from './dtos/update-quantity.cart.dto';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService extends BaseService<Cart> {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
  ) {
    super(cartRepository);
  }

  private async findCartByIsActive(user: User): Promise<Cart> {
    return this.findOne({
      relations: ['cartItems', 'cartItems.product'],
      where: {
        user: { id: user.id },
        isActive: true,
      },
    });
  }

  private async createCart(user: User): Promise<Cart> {
    return this.create({
      user: user,
      isActive: true,
    });
  }

  private async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.findCartByIsActive(user);

    if (!cart) {
      cart = await this.createCart(user);
    }

    return cart;
  }

  public async getCart(userId: string): Promise<Cart> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.findCartByIsActive(user);
  }

  public async addProduct(
    userId: string,
    addProductToCartDto: AddProductToCartDto,
  ): Promise<Cart> {
    const { productCode, quantity } = addProductToCartDto;

    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const product = await this.productService.findProductByCode(productCode);

    if (!product) {
      throw new NotFoundException(
        `El producto con el codigo ${productCode} no encontrado`,
      );
    }

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
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });

      cart.cartItems.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);

    return this.cartRepository.save(cart);
  }

  public async updateProductQuantity(
    userId: string,
    updateProductQuantityToCartDto: UpdateProductQuantityToCartDto,
  ): Promise<Cart> {
    const { productCode, quantity } = updateProductQuantityToCartDto;

    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const cart = await this.getOrCreateCart(user);

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.code === productCode,
    );

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      throw new NotFoundException(
        `Producto con el codigo ${productCode} no se encontro en el carrito`,
      );
    }

    await this.cartItemRepository.save(cartItem);

    return this.cartRepository.save(cart);
  }

  public async removeProductToCart(
    userId: string,
    productCode: string,
  ): Promise<Cart> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    const cart = await this.findCartByIsActive(user);

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item.product.code === productCode,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException(
        `Producto con el código ${productCode} no se encontró en el carrito`,
      );
    }

    const cartItem = cart.cartItems[cartItemIndex];

    await this.cartItemRepository.remove(cartItem);

    cart.cartItems.splice(cartItemIndex, 1);

    if (cart.cartItems.length === 0) {
      cart.isActive = false;
    }

    return this.cartRepository.save(cart);
  }
}
