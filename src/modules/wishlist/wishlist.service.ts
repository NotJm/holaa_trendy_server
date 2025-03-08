import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/base.service';
import { Wishlist } from './entity/wishlist.entity';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { ProductService } from '../products/product.service';
import { WishListItem } from './entity/wishlist-item.entity';

@Injectable()
export class WishlistService extends BaseService<Wishlist> {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishListItem)
    private readonly wishListItemRepository: Repository<WishListItem>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
  ) {
    super(wishlistRepository);
  }

  private findWishListByUser(user: User): Promise<Wishlist> {
    return this.findOne({
      relations: ['wishListItems', 'wishListItems.product'],
      where: {
        user: user,
      },
    });
  }

  private createWishList(user: User): Promise<Wishlist> {
    return this.create({
      user: user,
    });
  }

  private async getOrCreateWishList(user: User): Promise<Wishlist> {
    const cart = await this.findWishListByUser(user);

    if (!cart) {
      return this.createWishList(user);
    }

    return cart;
  }

  public async addProduct(
    userId: string,
    productCode: string,
  ): Promise<Wishlist> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const product = await this.productService.findProductByCode(productCode);

    if (!product) {
      throw new NotFoundException('El producto no se encontro');
    }

    const wishlist = await this.getOrCreateWishList(user);

    if (!wishlist.wishListItems) {
      wishlist.wishListItems = [];
    }

    let wishListItem = wishlist.wishListItems.find(
      (item) => item.product.code === productCode,
    );

    if (!wishListItem) {
      wishListItem = this.wishListItemRepository.create({
        wishlist,
        product,
      });

      wishlist.wishListItems.push(wishListItem);
    }

    await this.wishListItemRepository.save(wishListItem);

    return this.wishlistRepository.save(wishlist);

  }

  public async getWishList(userId: string): Promise<Wishlist> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    return await this.findWishListByUser(user);

  }

  public async removeProduct(
    userId: string,
    productCode: string,
  ): Promise<Wishlist> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('El usuario no existe')
    }

    const product = await this.productService.findProductByCode(productCode);

    if (!product) {
      throw new NotFoundException('El producto no existe')
    }

    const wishList = await this.findWishListByUser(user);

    if (!wishList) {
      throw new NotFoundException('Lista de deseos no existente');
    }

    const wishListIndex = wishList.wishListItems.findIndex(
      (item) => item.product.code === productCode
    )

    if (wishListIndex === -1) {
      throw new NotFoundException(
        `Producto con el codigo ${productCode} no se encontro en la lista de deseos`
      )
    }

    const wishListItem = wishList.wishListItems[wishListIndex];

    await this.wishListItemRepository.remove(wishListItem);

    wishList.wishListItems.splice(wishListIndex, 1);

    return this.wishlistRepository.save(wishList);


  }
}
