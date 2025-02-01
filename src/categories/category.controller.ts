import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '../common/interfaces/api.response.interface';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateManyCategoriesDto,
} from './dtos/create.category.dto';
import {
  UpdateCategoryDto,
  UpdateManyCategoriesDto,
} from './dtos/update.category.dto';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from '../common/constants/contants';
import { BaseController } from 'src/common/base.controller';

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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Post('create')
  async createCategory(
    @Body() createProductTypeDto: CreateCategoryDto,
  ): Promise<ApiResponse> {
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Post('create-many')
  async createManyCategories(
    @Body() createManyCategoriesDto: CreateManyCategoriesDto,
  ): Promise<ApiResponse> {
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
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  /**
   * Enpoint para poder actualizar una categoria
   * @param code Codigo de la categoria
   * @param updateCategorieDto Estructura para actualizar una categoria
   * @returns
   */
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Put('update')
  async updateCategory(
    @Body() updateCategorieDto: UpdateCategoryDto,
  ): Promise<ApiResponse> {
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Put('update-many')
  async updateManyCategories(
    @Body() updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<ApiResponse> {
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Delete('delete/:code')
  async deleteCategory(@Param('id') code: string): Promise<ApiResponse> {
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.EMPLOYEE)
  @Delete('delete-many')
  async deleteManyCategories(
    @Body('codes') codes: string[],
  ): Promise<ApiResponse> {
    try {
      const deleteCategories = await this.categoriesService.deleteMany(codes);

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
