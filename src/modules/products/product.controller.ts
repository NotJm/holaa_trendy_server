import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { AuditLog } from 'src/common/decorators/audit-log.decorator';
import { BaseController } from '../../common/base.controller';
import { ACTIONS_TYPE, ROLE } from '../../common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import {
    CreateManyProductsDto,
    CreateProductDto,
} from './dtos/create.product.dto';
import {
    UpdateManyProductsDto,
    UpdateProductDto,
} from './dtos/update.product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  /**
   * Endpoint para crear productos mediante un DTO
   * @param createProductDto DTO con estructura necesaria para crear producto
   * @returns
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  // @AuditLog({
  //   action: ACTIONS_TYPE.CREATE,
  //   module: 'products',
  //   getEntityId: (res) => res.id,
  // })
  @Post('create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<IApiResponse> {
    try {
      const createProduct =
        await this.productService.createOne(createProductDto);

      return {
        status: HttpStatus.OK,
        message: 'Producto creado exitosamente',
        data: createProduct,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para crear multiples productos mediante un DTO
   * @param createProductsDto
   * @returns
   */
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @AuditLog({
    action: ACTIONS_TYPE.CREATE,
    module: 'products',
    getEntityId: (res) => res.id,
  })
  @Post('create-many')
  async createManyProducts(
    @Body() createProductsDto: CreateManyProductsDto,
  ): Promise<IApiResponse> {
    try {
      const createProducts =
        await this.productService.createMany(createProductsDto);

      return {
        status: HttpStatus.OK,
        message: 'Productos creado exitosamente',
        data: createProducts,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint que obtiene todos los productos de la base de datos
   * @returns Todos los productos
   */
  @Get()
  async getProducts(): Promise<IApiResponse> {
    try {
      const product = await this.productService.getProducts();

      return {
        status: HttpStatus.OK,
        message: 'Successfully retrieved products',
        data: product,
      }

    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('view/:view')
  async getProductView(
    @Param('view') view: 'new-arrivals' | 'best-offers' | 'best-sellers',
  ) {
    return await this.productService.getProductsView(view);
  }

  /**
   * Endpoint for getting all products by category
   * @returns A promise that resolves when got all products by category succesfully
   */
  @Get('by-category/:category')
  async getProductsByCategory(@Param('category') category: string): Promise<IApiResponse> {
    try {
      const products = await this.productService.getProductsByCategory(category);

      return {
        status: HttpStatus.OK,
        message: 'Successfully retrieved products',
        data: products,
      }

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Metodo que filtra productos por medio de diferentres especificaciones
   * @param category Categoria necesario
   * @param subCategory Filtrado por sub categoria
   * @param size Filtrado por tallas
   * @param minPrice Filtrado por precio minimo
   * @param maxPrice Filtrado por precio maximo
   * @returns Arreglo de producto filtrados
   */
  @Get('filter')
  async getFilteredProducts(
    @Query('category') category: string,
    @Query('subCategory') subCategory: string,
    @Query('size') size: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.productService.getFilteredProducts(
      category,
      subCategory,
      size,
      minPrice,
      maxPrice,
    );
  }

  /**
   * Endpoint para buscar productos por medio de una palabra clave
   * @param keyword
   * @returns
   */
  // @UseGuards(ApikeyGuard)
  @Get('search')
  async getProductsByKeyword(@Query('keyword') keyword: string) {
    return this.productService.getProductsByKeyword(keyword);
  }

  // @UseGuards(ApikeyGuard)
  @Get('by-code/:code')
  async getProductByCode(@Param('code') code: string): Promise<IApiResponse> {
    try {
      const product = await this.productService.getProductByCode(code);

      return {
        status: HttpStatus.OK,
        message: 'Successfully retrieved product',
        data: product,
      }

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para actualizar un producto
   * @param code ID del producto
   * @param updateProductDto DTO para poder actualizar un producto
   * @returns Regresa el producto ya actualizado
   */
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @AuditLog({
    action: ACTIONS_TYPE.UPDATE,
    module: 'products',
    getEntityId: (res) => res.id 
  })
  @Put('update')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<IApiResponse> {
    try {
      const updateProduct =
        await this.productService.updateOne(updateProductDto);

      return {
        status: HttpStatus.OK,
        message: 'Producto actualizado exitosamente',
        data: updateProduct,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para actualizar varios productos
   * @param updateManyProductsDto Estructura para actualizar varios productos
   * @returns
   */
  @Put('update-many')
  @AuditLog({
    action: ACTIONS_TYPE.UPDATE,
    module: 'products',
    getEntityId: (res) => res.id,
  })
  async updateManyProducts(
    @Body() updateManyProductsDto: UpdateManyProductsDto,
  ): Promise<IApiResponse> {
    try {
      const updateProducts = await this.productService.updateMany(
        updateManyProductsDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Productos actualizados exitosamente',
        data: updateProducts,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para eliminar un producto
   * @param code ID del producto
   * @returns
   */
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @AuditLog({
    action: ACTIONS_TYPE.DELETE,
    module: 'products',
    getEntityId: (res) => res.id,
  })
  @Delete('delete/:code')
  async deleteProduct(@Param('code') code: string): Promise<IApiResponse> {
    try {
      const deleteProduct = await this.productService.deleteOne(code);

      return {
        status: HttpStatus.OK,
        message: 'El Producto ha sido eliminado exitosamente',
        data: deleteProduct,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para eliminar varios productos
   * @param codes Codigos de productos
   */
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @AuditLog({
    action: ACTIONS_TYPE.DELETE,
    module: 'products',
    getEntityId: (res) => res.id,
  })
  @Delete('delete-many')
  async deleteManyProducts(
    @Body('codes') codes: string[],
  ): Promise<IApiResponse> {
    try {
      const deleteProducts = await this.productService.deleteMany(codes);

      return {
        status: HttpStatus.OK,
        message: 'Los productos han sido eliminados exitosamente',
        data: deleteProducts,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
