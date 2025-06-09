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
import { BaseController } from '../../common/base.controller';
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import { CreateManySizesDto, CreateSizeDto } from './dtos/create.size.dto';
import { UpdateManySizesDto, UpdateSizeDto } from './dtos/update.size.dto';
import { Size } from './entity/sizes.entity';
import { SizesService } from './sizes.service';

@Controller('sizes')
export class SizesController extends BaseController {
  constructor(private readonly sizesService: SizesService) {
    super();
  }

  /**
   * Endpoint para crear una talla mediante un DTO
   * @param createSizeDto DTO con estructura necesaria para crear una talla
   * @returns
   */
  @Post('create')
  async createSize(@Body() createSizeDto: CreateSizeDto): Promise<IApiResponse> {
    try {
      const createSize = await this.sizesService.createOne(createSizeDto);

      return {
        status: HttpStatus.OK,
        message: 'Talla creada exitosamente',
        data: createSize,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para crear múltiples tallas mediante un DTO
   * @param createManySizesDto
   * @returns
   */
  @Post('create-many')
  async createManySizes(
    @Body() createManySizesDto: CreateManySizesDto,
  ): Promise<IApiResponse> {
    try {
      const createSizes =
        await this.sizesService.createManySizes(createManySizesDto);

      return {
        status: HttpStatus.OK,
        message: 'Tallas creadas exitosamente',
        data: createSizes,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint que obtiene todas las tallas de la base de datos
   * @returns Todas las tallas
   */
  @Get()
  async getSizes(): Promise<Size[]> {
    return await this.sizesService.getSizes();
  }

  /**
   * Endpoint para actualizar una talla
   * @param updateSizeDto DTO para poder actualizar una talla
   * @returns Regresa la talla ya actualizada
   */
  @Put('update')
  async updateSize(@Body() updateSizeDto: UpdateSizeDto): Promise<IApiResponse> {
    try {
      const updateSize = await this.sizesService.updateOne(updateSizeDto);

      return {
        status: HttpStatus.OK,
        message: 'Talla actualizada exitosamente',
        data: updateSize,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para actualizar varias tallas
   * @param updateManySizesDto Estructura para actualizar varias tallas
   * @returns
   */
  @Put('update-many')
  async updateManySizes(
    @Body() updateManySizesDto: UpdateManySizesDto,
  ): Promise<IApiResponse> {
    try {
      const updateSizes =
        await this.sizesService.updateMany(updateManySizesDto);

      return {
        status: HttpStatus.OK,
        message: 'Tallas actualizadas exitosamente',
        data: updateSizes,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para eliminar una talla
   * @param id ID de la talla
   * @returns
   */
  @Delete('delete/:id')
  async deleteSize(@Param('id') id: string): Promise<IApiResponse> {
    try {
      const deleteSize = await this.sizesService.deleteOne(id);

      return {
        status: HttpStatus.OK,
        message: 'La talla ha sido eliminada exitosamente',
        data: deleteSize,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint para eliminar varias tallas
   * @param ids IDs de las tallas
   */
  @Delete('delete-many')
  async deleteManySizes(@Body('ids') ids: string[]): Promise<IApiResponse> {
    try {
      const deleteSizes = await this.sizesService.deleteMany(ids);

      return {
        status: HttpStatus.OK,
        message: 'Las tallas han sido eliminadas exitosamente',
        data: deleteSizes,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
