import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { LoggerApp } from 'src/common/logger/logger.service';
import { In, Repository } from 'typeorm';
import { ProductVariant } from '../entity/product-variant.entity';
import { Product } from '../entity/products.entity';
import { Size } from 'src/modules/sizes/entity/sizes.entity';

@Injectable()
export class ProductVariantService extends BaseService<ProductVariant> {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly pVRepository: Repository<ProductVariant>,
    private readonly loggerApp: LoggerApp,
  ) {
    super(pVRepository);
  }

  public async findProductsVariantsByIds(
    ids: string[],
  ): Promise<ProductVariant[]> {
    const variants = await this.find({
      where: { id: In(ids) },
    });

    if (variants.length != 0) return variants;

    throw new NotFoundException(`Two or more products variants don't exists`);
  }

  public async findProductVariantById(id: string): Promise<ProductVariant> {
    const variant = await this.findOne({
      where: { id: id },
    });

    if (variant) return variant;

    this.loggerApp.warn(`The variant with ID ${id} don't exists`);
    throw new NotFoundException(`The variant with ID ${id} don't exists`);
  }

  public async findProductVariantByProductAndSize(
    product: Product,
    size: Size,
  ): Promise<ProductVariant> {
    const variant = await this.findOne({
      where: {
        product: { code: product.code },
        size: { id: size.id },
      },
    });

    if (variant) return variant;

    this.loggerApp.warn(
      `The varaint of product ID ${product.code} don't exists`,
    );
    throw new NotFoundException(
      `The varaint of product ID ${product.code} don't exists`,
    );
  }
}
