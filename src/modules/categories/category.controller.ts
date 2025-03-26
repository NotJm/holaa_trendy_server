import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { ROLE } from 'src/common/constants/contants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CategoryId } from '../../common/decorators/category.decorator';
import { IApiResponse } from '../../common/interfaces/api.response.interface';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateManyCategoriesDto,
} from './dtos/create.category.dto';
import {
  UpdateCategoryDto,
  UpdateManyCategoriesDto,
} from './dtos/update.category.dto';

@Controller('category')
export class CategoryController extends BaseController {
  constructor(private readonly categoriesService: CategoryService) {
    super();
  }

  /**
   * Endpoint para crear una categoria
   * @param createProductTypeDto DTO para crear un tipo de producto
   * @returns
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Post('create')
  async createCategory(
    @Body() createProductTypeDto: CreateCategoryDto,
  ): Promise<IApiResponse> {
    try {
      const createCategory =
        await this.categoriesService.createOne(createProductTypeDto);

      return {
        status: HttpStatus.OK,
        message: 'Categoria creada exitosamente',
        data: createCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para crear varias categorias
   * @param createManyCategoriesDto Estructura para crear varias categorias
   * @returns Regresa respuesta con las categorias creadas
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Post('create-many')
  async createManyCategories(
    @Body() createManyCategoriesDto: CreateManyCategoriesDto,
  ): Promise<IApiResponse> {
    try {
      const createCategories = await this.categoriesService.createMany(
        createManyCategoriesDto,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Categorias creada exitosamente',
        data: createCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para obtener todas las categorias
   * @returns Todas las categorias con sub categorias cada una
   */
  @Get()
  async getCategories(): Promise<IApiResponse> {
    try {
      const categories = await this.categoriesService.getCategories();

      return {
        status: HttpStatus.OK,
        message: 'Successfully retrieved categories',
        data: categories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('stock-initial')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async getStockInitial(): Promise<IApiResponse> {
    try {
      const stockInitialTotal = await this.categoriesService.getStockInitial();

      return {
        status: HttpStatus.OK,
        message: 'Stock inicial obtenido exitosamente',
        data: stockInitialTotal,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('stock-initial/:category')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async getStockInitialByCategory(
    @CategoryId() category: string,
  ): Promise<IApiResponse> {
    try {
      const stockInitialByCategory =
        await this.categoriesService.getStockInitialByCategory(category);

      return {
        status: HttpStatus.OK,
        message: 'Stock inicial obtenido exitosamente',
        data: stockInitialByCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('trend')
  async getCategoryTrend(): Promise<IApiResponse> {
    try {
      const categoryTrend = await this.categoriesService.getCategoryTrend();

      return {
        status: HttpStatus.OK,
        data: {
          category: categoryTrend,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Enpoint para poder actualizar una categoria
   * @param code Codigo de la categoria
   * @param updateCategorieDto Estructura para actualizar una categoria
   * @returns
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Put('update')
  async updateCategory(
    @Body() updateCategorieDto: UpdateCategoryDto,
  ): Promise<IApiResponse> {
    try {
      const updateCategory =
        await this.categoriesService.updateOne(updateCategorieDto);

      return {
        status: HttpStatus.OK,
        message: 'Categoria actualizada exitosamente',
        data: updateCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para poder actualizar varias categorias
   * @param updateManyCategories Estructura para actualizar varias categorias
   * @returns
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Put('update-many')
  async updateManyCategories(
    @Body() updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<IApiResponse> {
    try {
      const updateCategories = await this.categoriesService.updateMany(
        updateManyCategoriesDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Categorias actualizadas exitosamente',
        data: updateCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para poder eliminar una categoria por codigo
   * @param code
   * @returns
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Delete('delete/:id')
  async deleteCategory(@Param('id') code: string): Promise<IApiResponse> {
    try {
      const deleteCategory = await this.categoriesService.deleteOne(code);

      return {
        status: HttpStatus.OK,
        message: 'Categoria eliminada exitosamente',
        data: deleteCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para poder eliminar varias categorias
   */
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ROLE.EMPLOYEE)
  @Delete('delete-many')
  async deleteManyCategories(
    @Body('ids') ids: string[],
  ): Promise<IApiResponse> {
    try {
      const deleteCategories = await this.categoriesService.deleteMany(ids);

      return {
        status: HttpStatus.OK,
        message: 'Categorias eliminadas exitosamente',
        data: deleteCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
