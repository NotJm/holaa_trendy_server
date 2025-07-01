import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import {
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BaseService } from '../../common/base.service';
import { CategoryService } from '../categories/category.service';
import { ColorsService } from '../colors/colors.service';
import { SizesService } from '../sizes/sizes.service';
import { SubCategoryService } from '../sub-categories/sub-category.service';
import {
  CreateManyProductsDto,
  CreateProductDto,
} from './dtos/create.product.dto';
import {
  ProductResponseDto,
  toProductResponseDto,
} from './dtos/product.response.dto';
import {
  UpdateManyProductsDto,
  UpdateProductDto,
} from './dtos/update.product.dto';
import { BestOffers } from './entity/best-offers.entity';
import { BestSellers } from './entity/best-sellers.entity';
import { NewArrivals } from './entity/new-arrivals.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { ProductImages } from './entity/products-images.entity';
import { Product } from './entity/products.entity';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private readonly piRepository: Repository<ProductImages>,
    @InjectRepository(ProductVariant)
    private readonly pVRepository: Repository<ProductVariant>,
    @InjectRepository(NewArrivals)
    private readonly naRepository: Repository<NewArrivals>,
    @InjectRepository(BestOffers)
    private readonly boRepository: Repository<BestOffers>,
    @InjectRepository(BestSellers)
    private readonly bsRepository: Repository<BestSellers>,
    private readonly categoriesService: CategoryService,
    private readonly subCategoriesService: SubCategoryService,
    private readonly sizesService: SizesService,
    private readonly colorsService: ColorsService,
  ) {
    super(productsRepository);
  }

  /**
   * Handle the logic for finding a product through the code
   * @param code Product's code
   * @returns Returns the product with the identifier code
   * @throws
   */
  public async findProductByCode(code: string): Promise<Product> {
    const product = await this.findOne({
      relations: ['category', 'subCategories', 'images'],
      where: { code: code },
    });

    if (!product) {
      throw new NotFoundException("The product don't exists");
    }

    return product;
  }

  public async existsProductByCode(code: string): Promise<boolean> {
    const product = await this.findOne({
      relations: ['category', 'subCategories', 'images'],
      where: { code: code },
    });

    return !!product;
  }

  /**
   * Metodo que encuentra productos por su codigo
   * @param codes Codigos de los productos
   * @returns Regresa los productos con los codigos
   */
  public async findProductsByCodes(codes: string[]): Promise<Product[]> {
    return await this.find({
      relations: ['category', 'images'],
      where: { code: In(codes) },
    });
  }

  /**
   * Metodo que encuentra un producto en base a una categoria especifica
   * @param code  Codigo del producto
   * @returns Regresa el producto
   */
  public async findProductByCategory(code: string): Promise<Product> {
    return await this.findOne({
      relations: ['category'],
      where: {
        category: {
          name: code,
        },
      },
    });
  }

  /**
   * Metodo que encuentra todos los productos que pertenecen a una categoria
   * @param categoryName Nombre de la categoria
   * @returns Regresa listado de productos
   */
  private async findProductsByCategory(
    categoryName: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.find({
      where: {
        category: {
          name: categoryName,
        },
      },
      select: [
        'code',
        'name',
        'imgUri',
        'description',
        'price',
        'discount',
        'finalPrice',
      ],
      relations: ['category', 'subCategories', 'images'],
    });

    return products.map((product) => toProductResponseDto(product));
  }

  /**
   * Metodo para encontrar productos por palabra clave
   * @param keyword Palabras clave
   * @returns Productos que coincidan
   */
  private async findProductsByKeyword(keyword: string): Promise<Product[]> {
    return await this.find({
      where: [{ name: ILike(`%${keyword}%`) }],
    });
  }

  /**
   * Metodo sobrescrito de update donde se actualiza un producto
   * @param code Codigo del producto
   * @param data Datos del producto actualizar
   * @returns Regresa el producto actualizado
   */
  protected async update(
    code: string,
    data: Partial<Product>,
  ): Promise<Product> {
    const entity = await this.findProductByCode(code);

    if (!entity) {
      throw new InternalServerErrorException(
        `Producto con el codigo ${code} no encontrado`,
      );
    }

    Object.assign(entity, data);

    await this.repository.save(entity);
    return entity;
  }

  /**
   * Metodo sobrescrito de deleteById donde se elimina una producto
   * @param code Codigo de producto
   */
  protected async deleteById(code: string): Promise<Product> {
    const entity = await this.findProductByCode(code);

    if (!entity) {
      throw new InternalServerErrorException(
        `Producto con el codigo ${code} no encontrado`,
      );
    }

    return await this.productsRepository.remove(entity);
  }

  /**
   * Metodo para crear un producto
   * @param createProductDto Estructura donde se define datos basicos del producto
   * @returns Regresa una respuesta
   */
  public async createOne(createProductDto: CreateProductDto): Promise<any> {
    const { code, categoryName, variants, subCategoriesNames, images } =
      createProductDto;

    if (await this.existsProductByCode(code)) {
      throw new ConflictException(
        `The Product with the code '${code}' already exists`,
      );
    }

    const category =
      await this.categoriesService.findCategoryByName(categoryName);

    const subCategories =
      await this.subCategoriesService.findSubCategoriesByNames(
        subCategoriesNames,
      );

    const productCreate = await this.create({
      ...createProductDto,
      category: category,
      subCategories: subCategories,
      images: [],
      productVariant: [],
    });

    const productImages = images.map((imageUrl) => {
      const image = new ProductImages();
      image.url = imageUrl;
      image.product = productCreate;
      return image;
    });

    const productVariant = await Promise.all(
      variants.map(async (variant) => {
        const color = await this.colorsService.findColorByName(variant.color);
        const size = await this.sizesService.findSizeByName(variant.size);

        if (!color) {
          throw new NotFoundException(
            `The next color '${variant.color}' don't exists`,
          );
        }

        if (!size) {
          throw new NotFoundException(
            `The next size '${variant.size}' don't exists`,
          );
        }

        const v = new ProductVariant();
        v.product = productCreate;
        v.color = color;
        v.size = size;
        v.stock = variant.stock;
        return v;
      }),
    );

    await this.piRepository.save(productImages);

    await this.pVRepository.save(productVariant);

    productCreate.images = productImages;

    productCreate.productVariant = productVariant;

    return instanceToPlain(productCreate);
  }

  /**
   * Metodo para crear varios productos
   * @param createManyProductsDto Estructura necesaria para crear varios productos
   * @returns Regresa los productos creados
   */
  public async createMany(
    createManyProductsDto: CreateManyProductsDto,
  ): Promise<Product[]> {
    const { products } = createManyProductsDto;

    const createProducts = await Promise.all(
      products.map(async (product) => {
        return await this.createOne(product);
      }),
    );

    return createProducts;
  }

  /**
   * Get the all products from the provide data base
   * @returns All the products
   */
  public async getProducts(): Promise<ProductResponseDto[]> {
    const products = await this.find({
      relations: ['category', 'subCategories'],
    });
    return products.map((product) => toProductResponseDto(product));
  }

  /**
   * Get materialized view from the provide data base
   * @param view - Materialized view name
   * @returns A promise that resolves when the materialized view is successfully got
   */
  public async getProductsView(
    view: 'new-arrivals' | 'best-offers' | 'best-sellers',
  ): Promise<any> {
    const repositoryMap = {
      'new-arrivals': this.naRepository,
      'best-offers': this.boRepository,
      'best-sellers': this.bsRepository,
    };

    const repository = repositoryMap[view];

    if (!repository) {
      throw new Error(`Invalid view name: ${view}`);
    }

    return await repository.find();
  }

  /**
   * Metodo que obtienen todos los productos de una categoria especifica
   * @param category Categoria especifica
   * @returns Listado de productos de categoria especefica
   */
  public async getProductsByCategory(
    category: string,
  ): Promise<ProductResponseDto[]> {
    return await this.findProductsByCategory(category);
  }

  /**
   * Metodo que obtiene productos filtrados por diferentes especificaciones
   * @param category
   * @param subCategory
   * @param size
   * @param minPrice
   * @param maxPrice
   * @returns
   */
  public async getFilteredProducts(
    category: string,
    subCategory?: string,
    size?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<ProductResponseDto[]> {
    const whereConditions: any = {};

    whereConditions.category = { name: category };

    if (subCategory) {
      whereConditions.subCategories = { name: subCategory };
    }

    if (size) {
      whereConditions.sizes = { size: size };
    }
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) {
        whereConditions.price = MoreThanOrEqual(minPrice);
      }
      if (maxPrice) {
        whereConditions.price = LessThanOrEqual(maxPrice);
      }
    }

    const productsFiltered = await this.find({
      relations: ['category', 'subCategories', 'sizes'],
      where: whereConditions,
    });

    return productsFiltered.map((product) => toProductResponseDto(product));
  }

  /**
   * Metodo para obtener los productos por medio de palabra clave
   * @param keyword Palara clave
   * @returns Productos que coincidan con la palabra clave
   */
  public async getProductsByKeyword(keyword: string): Promise<Product[]> {
    return await this.findProductsByKeyword(keyword);
  }

  public async getProductByCode(code: string): Promise<ProductResponseDto> {
    const product = await this.findProductByCode(code);
    return toProductResponseDto(product);
  }

  /**
   * Metodo para actualizar un producto
   * @param code Codigo del producto
   * @param updateProductDto Estructura parcial de datos que se pueden modificar
   * @returns
   */
  public async updateOne(updateProductDto: UpdateProductDto): Promise<Product> {
    const { code } = updateProductDto;

    let existsSizes,
      existsColors,
      existsImages,
      existsCategory,
      existsSubCategories;

    const product = await this.findProductByCode(code);

    if (!product) {
      throw new NotFoundException(
        `Producto con el codigo ${code} no encontrado`,
      );
    }

    if (updateProductDto.sizes) {
      existsSizes = await this.sizesService.findSizesByIDs(
        updateProductDto.sizes,
      );
    }

    if (updateProductDto.colors) {
      existsColors = await this.colorsService.findColorsByNames(
        updateProductDto.colors,
      );
    }

    if (updateProductDto.categoryName) {
      existsCategory = await this.categoriesService.findCategoryByName(
        updateProductDto.categoryName,
      );
    }

    if (updateProductDto.subCategoriesNames) {
      existsSubCategories =
        await this.subCategoriesService.findSubCategoriesByNames(
          updateProductDto.subCategoriesNames,
        );
    }

    return await this.update(code, {
      ...updateProductDto,
      images: existsImages || product.images,
      category: existsCategory || product.category,
      subCategories: existsSubCategories || product.subCategories,
    });
  }

  /**
   * Metodo para actualizar un producto
   * @param code Codigo del producto
   * @param updateManyProductDto Estructura parcial de datos que se pueden modificar
   * @returns
   */
  public async updateMany(
    updateManyProductDto: UpdateManyProductsDto,
  ): Promise<Product[]> {
    const { products } = updateManyProductDto;
    const updateProducts = Promise.all(
      products.map(async (product) => {
        return await this.updateOne(product);
      }),
    );
    return updateProducts;
  }

  /**
   * Metodo que elimina un producto
   * @param code Codigo del producto
   * @returns Respuesta
   */
  async deleteOne(code: string): Promise<Product> {
    return await this.deleteById(code);
  }

  /**
   * Metodo que elimina varios productos
   * @param codes Codigos de los productos
   * @returns Productos eliminados
   */
  async deleteMany(codes: string[]): Promise<Product[]> {
    const deleteProducts = Promise.all(
      codes.map(async (code) => {
        return await this.deleteOne(code);
      }),
    );
    return deleteProducts;
  }
}
