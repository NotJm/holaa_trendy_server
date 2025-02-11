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
import { BaseController } from 'src/common/base.controller';
import { ApiResponse } from '../../common/interfaces/api.response.interface';
import { ColorsService } from './colors.service';
import { CreateColorDto, CreateManyColorsDto } from './dtos/create.color.dto';
import { UpdateColorDto, UpdateManyColorsDto } from './dtos/update.color.dto';
import { Color } from './entity/colors.entity';

// TODO DOCUMENTAR CODIGO

@Controller('colors')
export class ColorsController extends BaseController {
  constructor(private readonly colorsService: ColorsService) {
    super();
  }

  /**
   * Endpoint que regresa todos los colores
   * @returns Regresa todos los colores hasta al momento
   */
  @Get()
  async getColor(): Promise<Color[]> {
    return await this.colorsService.getColors()
  }

  /**
   * Endpoint que crea un color 
   * @param createColorDto Estructura DTO para crear colores
   * @returns 
   */
  @Post('create')
  async createColor(
    @Body() createColorDto: CreateColorDto,
  ): Promise<ApiResponse> {
    try {
      const createColor = await this.colorsService.createOne(createColorDto);

      return {
        status: HttpStatus.OK,
        message: 'El color sea ha creado con exito',
        data: createColor,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para crear muchos colores
   * @param createManyColorsDto Estructura DTO para crear muchos colores
   * @returns 
   */
  @Post('create-many')
  async createManyColors(
    @Body() createManyColorsDto: CreateManyColorsDto,
  ): Promise<ApiResponse> {
    try {
      const createColors =
        await this.colorsService.createMany(createManyColorsDto);

      return {
        status: HttpStatus.OK,
        message: 'Los colores se han creado con exito',
        data: createColors,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint parac
   * @param updateColorDto 
   * @returns 
   */
  @Put('update')
  async updateColor(
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<ApiResponse> {
    try {
      const updateColor = await this.colorsService.updateOne(updateColorDto);

      return {
        status: HttpStatus.OK,
        message: 'El color se ha actualizado con exito',
        data: updateColor,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put('update-many')
  async updateManyColors(
    @Body() updateManyColorsDto: UpdateManyColorsDto,
  ): Promise<ApiResponse> {
    try {
      const updateColors =
        await this.colorsService.updateMany(updateManyColorsDto);

      return {
        status: HttpStatus.OK,
        message: 'Los colores se han actualizado con exito',
        data: updateColors,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete('delete/:id')
  async deleteColor(@Param('id') id: string): Promise<ApiResponse> {
    try {
      const deleteColor = await this.colorsService.deleteOne(id);

      return {
        status: HttpStatus.OK,
        message: 'El color ha sido eliminado con exito',
        data: deleteColor,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete('delete-many')
  async deleteManyColors(@Body('ids') ids: string[]): Promise<ApiResponse> {
    try {
      const deleteColors = await this.colorsService.deleteMany(ids);

      return {
        status: HttpStatus.OK,
        message: 'Los colores han sido eliminado exito',
        data: deleteColors
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}
