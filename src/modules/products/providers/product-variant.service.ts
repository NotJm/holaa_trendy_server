import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { LoggerApp } from 'src/common/logger/logger.service';
import { Size } from 'src/modules/sizes/entity/sizes.entity';
import { SizesService } from 'src/modules/sizes/sizes.service';
import { In, Repository } from 'typeorm';
import { CreateProductVariantDto } from '../dtos/create.product_variant.dto';
import { ProductVariant } from '../entity/product-variant.entity';
import { Product } from '../entity/products.entity';

@Injectable()
export class ProductVariantService extends BaseService<ProductVariant> {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly pVRepository: Repository<ProductVariant>,
    private readonly sizesService: SizesService,
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

    this.loggerApp.warn('Dos o mas variantes de productos no existen');
    throw new NotFoundException(`Dos o mas variantes de productos no existen`);
  }

  public async findProductVariantById(id: string): Promise<ProductVariant> {
    const variant = await this.findOne({
      where: { id: id },
    });

    if (variant) return variant;

    this.loggerApp.warn(`La variante con id: ${id} no existe`);
    throw new NotFoundException(`La variante con id ${id} no existe`);
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
      `La variante del producto con codigo: ${product.code} no existen`,
    );
    throw new NotFoundException(
      `La variantE del producto con codigo: ${product.code} no existen`,
    );
  }

  public async findProductVariantsByProduct(
    product: Product,
  ): Promise<ProductVariant[]> {
    const variant = await this.find({
      where: {
        product: { code: product.code },
      },
    });

    if (variant.length > 0) return variant;

    this.loggerApp.warn(
      `Las variantes del producto con codigo: ${product.code} no existen`,
    );
    throw new NotFoundException(
      `Las variantes del producto con codigo: ${product.code} no existen`,
    );
  }

  public async createOne(
    variant: CreateProductVariantDto,
    product: Product,
  ): Promise<ProductVariant> {
    const size = await this.sizesService.findSizeByName(variant.sizeName);
    return await this.create({
      product: product,
      size: size,
      stock: variant.stock,
    });
  }

  public async createMany(
    variants: CreateProductVariantDto[],
    product: Product,
  ): Promise<ProductVariant[]> {
    return Promise.all(
      variants.map(async (variant) => {
        return await this.createOne(variant, product);
      }),
    );
  }

  public async updateOne(
    variants: CreateProductVariantDto[],
    product: Product,
  ): Promise<ProductVariant[]> {
    const productVariants = await this.findProductVariantsByProduct(product);

    const toUpdated = variants.slice(0, productVariants.length);
    const toCreated = variants.slice(productVariants.length);

    const productVariantsUpdated = await Promise.all(
      productVariants
        .slice(0, toUpdated.length)
        .map(async (productVariant, idx) => {
          return this.update(productVariant.id, {
            stock: toUpdated[idx].stock,
            product: product,
          });
        }),
    );

    const productVariantsCreated = toCreated.length
      ? await this.createMany(toCreated, product)
      : [];

    return [...productVariantsUpdated, ...productVariantsCreated];
  }

  public async deleteOne(id: string): Promise<ProductVariant> {
    return this.deleteById(id);
  }

  public async deleteMany(
    productVariants: ProductVariant[],
  ): Promise<ProductVariant[]> {
    return Promise.all(
      productVariants.map(async (productVariant) => {
        return await this.deleteOne(productVariant.id);
      }),
    );
  }
}
