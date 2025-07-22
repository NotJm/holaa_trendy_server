import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
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
  FeaturedProductResponseDto,
  LowStockProductResponseDto,
  ProductResponseDto,
  toFeaturedProductResponseDto,
  toLowStockProductResponseDto,
  toProductResponseDto,
} from './dtos/product.response.dto';
import {
  UpdateManyProductsDto,
  UpdateProductDto,
} from './dtos/update.product.dto';
import { BestOffers } from './entity/best-offers.entity';
import { BestSellers } from './entity/best-sellers.entity';
import { LowStockProducts } from './entity/low-stock-products.entity';
import { NewArrivals } from './entity/new-arrivals.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { ProductImages } from './entity/products-images.entity';
import { Product } from './entity/products.entity';
import { ProductImageService } from './providers/product-image.service';
import { ProductVariantService } from './providers/product-variant.service';

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
    @InjectRepository(LowStockProducts)
    private readonly lspRepository: Repository<LowStockProducts>,
    private readonly piService: ProductImageService,
    private readonly pvService: ProductVariantService,
    private readonly categoriesService: CategoryService,
    private readonly subCategoriesService: SubCategoryService,
    private readonly sizesService: SizesService,
    private readonly colorsService: ColorsService,
    private readonly cloudinaryService: CloudinaryService,
    // private readonly saleService: SaleService,
    // private readonly recommenderService: RecomenderService
  ) {
    super(productsRepository);
  }

  relations: string[] = [
    'category',
    'subCategories',
    'images',
    'color',
    'variants',
  ];

  /**
   * Handle the logic for finding a product through the code
   * @param code Product's code
   * @returns Returns the product with the identifier code
   * @throws
   */
  public async findProductByCode(code: string): Promise<Product> {
    const product = await this.findOne({
      relations: this.relations,
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
      relations: this.relations,
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
      relations: ['category', 'subCategories', 'images', 'color', 'variants'],
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
  public async createOne(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const {
      code,
      images,
      categoryName,
      subCategoriesNames,
      colorName,
      variants,
    } = createProductDto;

    if (await this.existsProductByCode(code)) {
      throw new ConflictException(
        `El producto con el codigo: '${code}' ya existe`,
      );
    }

    const category =
      await this.categoriesService.findCategoryByName(categoryName);

    const subCategories =
      await this.subCategoriesService.findSubCategoriesByNames(
        subCategoriesNames,
      );

    const color = await this.colorsService.findColorByName(colorName);

    const productCreate = await this.create({
      ...createProductDto,
      category: category,
      subCategories: subCategories,
      color: color,
      images: [],
      variants: [],
    });

    const productImages = images.map((imageUrl) => {
      const image = new ProductImages();
      image.url = imageUrl;
      image.product = productCreate;
      return image;
    });

    const productVariant = await Promise.all(
      variants.map(async (variant) => {
        const size = await this.sizesService.findSizeByName(variant.sizeName);

        if (!size) {
          throw new NotFoundException(
            `The next size '${variant.sizeName}' don't exists`,
          );
        }

        const v = new ProductVariant();
        v.product = productCreate;
        v.size = size;
        v.stock = variant.stock;
        return v;
      }),
    );

    await this.piRepository.save(productImages);

    await this.pVRepository.save(productVariant);

    productCreate.images = productImages;

    productCreate.variants = productVariant;

    return toProductResponseDto(productCreate);
  }

  /**
   * Metodo para crear varios productos
   * @param createManyProductsDto Estructura necesaria para crear varios productos
   * @returns Regresa los productos creados
   */
  public async createMany(
    createManyProductsDto: CreateManyProductsDto,
  ): Promise<ProductResponseDto[]> {
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
      relations: this.relations,
    });
    return products.map((product) => toProductResponseDto(product));
  }

  /**
   * Get materialized view from the provide data base
   * @param view - Materialized view name
   * @returns A promise that resolves when the materialized view is successfully got
   */
  public async getProductsView(
    view: 'new-arrivals' | 'best-offers' | 'best-sellers' | 'low-stock',
  ): Promise<FeaturedProductResponseDto[]> {
    const repositoryMap = {
      'new-arrivals': this.naRepository,
      'best-offers': this.boRepository,
      'best-sellers': this.bsRepository,
    };

    const repository = repositoryMap[view];

    if (!repository) {
      throw new Error(`Invalid view name: ${view}`);
    }

    const featuredProduct = await repository.find();

    return featuredProduct.map((featuredProduct) =>
      toFeaturedProductResponseDto(featuredProduct),
    );
  }

  public async getLowStockProducts(): Promise<LowStockProductResponseDto[]> {
    const lowStockProducts = await this.lspRepository.find();

    return lowStockProducts.length > 0
      ? lowStockProducts.map((lowStockProduct) =>
          toLowStockProductResponseDto(lowStockProduct),
        )
      : [];
  }

  // public async getRecommenderProducts(
  //   userId: string,
  // ): Promise<FeaturedProductResponseDto[]> {
  //   const sale = await this.saleService.findSaleByUserId(userId);

  //   if (!sale) return [];

  //   const productCode = sale.saleItems[0].product.code;

  //   const codes = await this.recommenderService.getRecomenderProducts(
  //     productCode,
  //     5,
  //   );

  //   const products = await this.findProductsByCodes(codes);

  //   return products.map((product) => toFeaturedProductResponseDto(product));
  // }

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
    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategories', 'subCategory')
      .leftJoinAndSelect('product.variants', 'variant');

    qb.where('category.name = :category', { category });

    if (subCategory) {
      qb.andWhere('subCategory.name = :subCategory', { subCategory });
    }

    if (size) {
      qb.andWhere('variant.size = :size', { size });
    }

    if (minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const productsFiltered = await qb.getMany();

    return productsFiltered.map(toProductResponseDto);
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
  public async updateOne(
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const {
      code,
      imgUri,
      categoryName,
      subCategoriesNames,
      images,
      colorName,
      variants,
    } = updateProductDto;

    const product = await this.findProductByCode(code);

    const category =
      await this.categoriesService.findCategoryByName(categoryName);

    const subCategories =
      await this.subCategoriesService.findSubCategoriesByNames(
        subCategoriesNames,
      );

    const color = await this.colorsService.findColorByName(colorName);

    this.cloudinaryService.deleteFolder(`products/${categoryName}/${code}`);

    const { secure_url } = await this.cloudinaryService.uploadImage(
      imgUri,
      `products/${categoryName}/${code}`,
    );

    const productImages = await this.piService.updateOne(images, product);

    const productVariants = await this.pvService.updateOne(variants, product);

    const productUpdated = await this.update(code, {
      ...updateProductDto,
      color: color,
      imgUri: secure_url,
      category: category,
      subCategories: subCategories,
      images: productImages,
      variants: productVariants,
    });

    return toProductResponseDto(productUpdated);
  }

  /**
   * Metodo para actualizar un producto
   * @param code Codigo del producto
   * @param updateManyProductDto Estructura parcial de datos que se pueden modificar
   * @returns
   */
  public async updateMany(
    updateManyProductDto: UpdateManyProductsDto,
  ): Promise<ProductResponseDto[]> {
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
