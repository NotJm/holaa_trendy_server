import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { ProductImages } from '../entity/products-images.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/products.entity';

@Injectable()
export class ProductImageService extends BaseService<ProductImages> {
  constructor(
    @InjectRepository(ProductImages)
    private readonly piRepository: Repository<ProductImages>,
  ) {
    super(piRepository);
  }

  public async createOne(images: string[], product: Product): Promise<ProductImages[]> {
    return images.map((image) => {
      return {
        url: image,
        product: product,
      } as ProductImages;
    });

    // productImages.forEach((productImage) => this.create(productImage));
  }
}
