import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import {
  CreateManySubCategoriesDto,
  CreateSubCategoryDto,
} from './dtos/create.sub-category.dto';
import {
  UpdateManySubCategoriesDto,
  UpdateSubCategoryDto,
} from './dtos/update.sub-category.dto';
import { SubCategoryService } from './sub-category.service';
import { ApiResponse } from '../common/interfaces/api.response.interface';

@Controller('sub-category')
export class SubCategoryController extends BaseController {
  constructor(private readonly subCategoriesService: SubCategoryService) {
    super();
  }

  /**
   * Endpoint para crear una sub categoria
   * @param createSubCategoryDto Estructura predefinida con datos basicos para crear una sub categoria
   * @returns Sub Categoria Creada
   */
  @Post('create')
  async createSubCategory(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<ApiResponse> {
    try {
      const createSubCategory =
        await this.subCategoriesService.createOne(createSubCategoryDto);

      return {
        status: HttpStatus.OK,
        message: 'Sub Categoria creada con exito',
        data: createSubCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para crear varias sub categorias
   * @param createManySubCategoriesDto Estructura para crear varias sub categorias
   * @returns
   */
  @Post('create-many')
  async createManySubCategory(
    @Body() createManySubCategoriesDto: CreateManySubCategoriesDto,
  ): Promise<ApiResponse> {
    try {
      const createSubCategories = await this.subCategoriesService.createMany(
        createManySubCategoriesDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Sub Categorias creadas exitosamente',
        data: createSubCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para obtener todas las sub categorias
   * @returns
   */
  @Get()
  async getSubCategories() {
    return await this.subCategoriesService.getSubCategories();
  }

  /**
   * Endpoint que obtiene todos los productos en base a la categoria de la base de datos
   * @returns Todos los productos
   */
  @Get('by-category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    return await this.subCategoriesService.getSubCategoriesByCategory(category);
  }

  /**
   * Endpoint para actualizar una sub categoria
   * @param updateSubCategoryDto Estructura predefinida con datos basicos para actualizar un sub categoria
   * @returns
   */
  @Put('update')
  async updateSubCategory(
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<ApiResponse> {
    try {
      const updateSubCategory =
        await this.subCategoriesService.updateOne(updateSubCategoryDto);

      return {
        status: HttpStatus.OK,
        message: 'Sub Categoria creada exitosamente',
        data: updateSubCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Metodo para actualizar varias sub categorias
   * @param updateManySubCategoriesDto Estructura para actualizar varias sub categorias
   * @returns
   */
  @Put('update-many')
  async updateManySubCategories(
    @Body() updateManySubCategoriesDto: UpdateManySubCategoriesDto,
  ): Promise<ApiResponse> {
    try {
      const updateSubCategories = await this.subCategoriesService.updateMany(
        updateManySubCategoriesDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Sub Categorias creadas exitosamente',
        data: updateSubCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para eliminar una sub categoria
   * @param code Codigo de la sub categoria
   * @returns Respuesta
   */
  @Delete('delete/:code')
  async deleteSubCategory(@Param('code') code: string): Promise<ApiResponse> {
    try {
      const deleteSubCategory = await this.subCategoriesService.deleteOne(code);

      return {
        status: HttpStatus.OK,
        message: 'Sub Categoria eliminada exitosamente',
        data: deleteSubCategory,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete('delete-many')
  async deleteManySubCategories(
    @Body('codes') codes: string[],
  ): Promise<ApiResponse> {
    try {
      const deleteSubCategories =
        await this.subCategoriesService.deleteMany(codes);

      return {
        status: HttpStatus.OK,
        message: 'Sub Categorias eliminadas exitosamente',
        data: deleteSubCategories,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
