import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { ProductImages } from '../entity/products-images.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/products.entity';
import { LoggerApp } from 'src/common/logger/logger.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class ProductImageService extends BaseService<ProductImages> {
  constructor(
    @InjectRepository(ProductImages)
    private readonly piRepository: Repository<ProductImages>,
    private readonly loggerApp: LoggerApp,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(piRepository);
  }

  public async findProductImagesByProduct(
    product: Product,
  ): Promise<ProductImages[]> {
    const productImages = await this.find({
      where: { product: { code: product.code } },
    });

    if (productImages.length > 0) return productImages;

    this.loggerApp.warn(
      `Las imagenes del producto con codigo: ${product.code} no existen`,
    );
    throw new NotFoundException(
      `Las imagenes del producto con codigo: ${product.code} no existen`,
    );
  }

  public async createOne(
    image: string,
    product: Product,
  ): Promise<ProductImages> {
    return this.create({
      product: product,
      url: image,
    });
  }

  public async createMany(
    images: string[],
    product: Product,
  ): Promise<ProductImages[]> {
    return await Promise.all(
      images.map(async (image) => {
        return await this.createOne(image, product);
      }),
    );
  }

  public async updateOne(
    images: string[],
    product: Product,
  ): Promise<ProductImages[]> {
    const imagesUpload = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await this.cloudinaryService.uploadImage(
          image,
          `products/${product.category.name}/${product.code}`,
        );

        return secure_url;
      }),
    );

    const productImages = await this.findProductImagesByProduct(product);

    const toUpdated = imagesUpload.slice(0, productImages.length);
    const toCreated = imagesUpload.slice(productImages.length);

    const productImagesUpdated = await Promise.all(
      productImages.map(async (productImage, idx) => {
        if (!toUpdated[idx]) return;

        return await this.update(`${productImage.id}`, {
          product: product,
          url: toUpdated[idx],
        });
      }),
    );

    if (toCreated.length > 0) {
      productImagesUpdated.push(...(await this.createMany(toCreated, product)));
    }

    return productImagesUpdated;
  }

  public async deleteOne(id: string): Promise<void> {
    await this.deleteById(id);
  }

  public async deleteMany(productImages: ProductImages[]): Promise<void[]> {
    return Promise.all(
      productImages.map(async (productImage) => {
        return await this.deleteOne(`${productImage.id}`);
      }),
    );
  }
}
