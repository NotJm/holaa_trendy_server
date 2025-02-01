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

@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  /**
   * Endpoint para crear una categoria
   * @param createProductTypeDto DTO para crear un tipo de producto
   * @returns
   */
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
      throw error;
    }
  }
  
  /**
   * Endpoint para crear varias categorias
   * @param createManyCategoriesDto Estructura para crear varias categorias
   * @returns Regresa respuesta con las categorias creadas
   */
  @Post('create-many')
  async createManyCategories(
    @Body() createManyCategoriesDto: CreateManyCategoriesDto,
  ): Promise<ApiResponse> {
    try {
      
      const createCategories = 
        await this.categoriesService.createMany(createManyCategoriesDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Categorias creada exitosamente',
        data: createCategories
      }

    } catch (error) {
      throw error;
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
  @Put('update/:code')
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
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  /**
   * Endpoint para poder actualizar varias categorias
   * @param updateManyCategories Estructura para actualizar varias categorias
   * @returns
   */
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
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  /**
   * Endpoint para poder eliminar una categoria por codigo
   * @param code
   * @returns
   */
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
      throw error;
    }
  }

  /**
   * Endpoint para poder eliminar varias categorias
   */
  @Delete('delete-many')
  async deleteManyCategories(@Body() codes: string[]): Promise<ApiResponse> {
    try {
      const deleteCategories = await this.categoriesService.deleteMany(codes);

      return {
        status: HttpStatus.OK,
        message: 'Categorias eliminadas exitosamente',
        data: deleteCategories,
      };
    } catch (error) {
      throw error;
    }
  }
}
