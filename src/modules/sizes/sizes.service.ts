import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CreateManySizesDto, CreateSizeDto } from './dtos/create.size.dto';
import { UpdateManySizesDto, UpdateSizeDto } from './dtos/update.size.dto';
import { Size } from './entity/sizes.entity';

@Injectable()
export class SizesService extends BaseService<Size> {
  constructor(
    @InjectRepository(Size)
    private readonly sizesRepository: Repository<Size>,
  ) {
    super(sizesRepository);
  }

  /**
   * Busca una talla por su ID
   * @param size - La talla a buscar
   * @returns Una promesa que se resuelve con la talla encontrada
   */
  async findSizeByName(size: string): Promise<Size> {
    return await this.findOne({
      where: { size: size },
    });
  }

  public async existsSizeByName(sizeName: string): Promise<boolean> {
    const size = await this.findOne({
      where: { size: sizeName }
    })

    return !!size;

  }

  /**
   * Busca múltiples tallas por sus IDs
   * @param ids - Un array de IDs de tallas a buscar
   * @returns Una promesa que se resuelve con un array de tallas encontradas
   */
  async findSizesByIDs(ids: string[]): Promise<Size[]> {
    return await this.find({
      where: { size: In(ids) },
    });
  }

  /**
   * Crea una sola talla
   * @param createSizeDto - El DTO que contiene la información de la talla
   * @returns Una promesa que se resuelve con la talla creada
   */
  public async createOne(createSizeDto: CreateSizeDto): Promise<Size> {
    const { size: id } = createSizeDto;

    const existsSize = await this.findSizeByName(id);

    if (existsSize) {
      throw new ConflictException(`Ya existe una talla con el ID ${id}`);
    }

    const createSize = await this.create(createSizeDto);

    return createSize;
  }

  /**
   * Crea múltiples tallas
   * @param createManySizesDto - El DTO que contiene un array de tallas a crear
   * @returns Una promesa que se resuelve con un array de tallas creadas
   */
  public async createManySizes(
    createManySizesDto: CreateManySizesDto,
  ): Promise<Size[]> {
    const createSizes = await Promise.all(
      createManySizesDto.sizes.map(async (size) => {
        return await this.createOne(size);
      }),
    );

    return createSizes;
  }

  /**
   * Obtiene todas las tallas
   * @returns Una promesa que se resuelve con un array de todas las tallas
   */
  public async getSizes(): Promise<Size[]> {
    return await this.findAll();
  }

  /**
   * Actualiza una sola talla
   * @param updateSizeDto - El DTO que contiene la información de actualización
   * @returns Una promesa que se resuelve con la talla actualizada
   */
  public async updateOne(updateSizeDto: UpdateSizeDto): Promise<Size> {
    const { id, newSize } = updateSizeDto;

    const size = await this.findById(id);

    if (!size) {
      throw new NotFoundException(
        `La talla con el identificador ${id} no se encontró`,
      );
    }

    if (newSize) {
      const existsSizeWithId = await this.findSizeByName(newSize);

      if (existsSizeWithId) {
        throw new ConflictException(`Ya existe una talla con el ID ${newSize}`);
      }

      size.size = newSize;
    }

    return await this.update(id, size);
  }

  /**
   * Actualiza múltiples tallas
   * @param updateManySizesDto - El DTO que contiene un array de tallas a actualizar
   * @returns Una promesa que se resuelve con un array de tallas actualizadas
   */
  public async updateMany(
    updateManySizesDto: UpdateManySizesDto,
  ): Promise<Size[]> {
    const { sizes } = updateManySizesDto;

    const updateSizes = await Promise.all(
      sizes.map(async (size) => {
        return await this.updateOne(size);
      }),
    );

    return updateSizes;
  }

  /**
   * Elimina una sola talla
   * @param id - El ID de la talla a eliminar
   * @returns Una promesa que se resuelve con la talla eliminada
   */
  public async deleteOne(id: string): Promise<Size> {
    return await this.deleteById(id);
  }

  /**
   * Elimina múltiples tallas
   * @param ids - Un array de IDs de tallas a eliminar
   * @returns Una promesa que se resuelve con un array de tallas eliminadas
   */
  public async deleteMany(ids: string[]): Promise<Size[]> {
    const deleteSizes = await Promise.all(
      ids.map(async (id) => {
        return await this.deleteOne(id);
      }),
    );
    return deleteSizes;
  }
}
