import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CreateManySizesDto } from './dtos/create.size.dto';
import { Sizes } from './entity/sizes.entity';

@Injectable()
export class SizesService extends BaseService<Sizes> {
  constructor(
    @InjectRepository(Sizes)
    private readonly sizesRepository: Repository<Sizes>,
  ) {
    super(sizesRepository);
  }

  async findSizeByID(id: string): Promise<Sizes> {
    return await this.findOne({
      where: { size: id },
    });
  }

  async findSizesByIDs(ids: string[]): Promise<Sizes[]> {
    return await this.find({
      where: { size: In(ids) },
    });
  }

  public async createManySizes(
    createManySizesDto: CreateManySizesDto,
  ): Promise<any> {
    for (const createSizeDto of createManySizesDto.sizes) {
      const { size: id } = createSizeDto;

      const existsSize = await this.findSizeByID(id);

      if (existsSize) {
        throw new ConflictException('Ya existe un talla con ese ID');
      }

      await this.create(createSizeDto);
    }

    return {
      status: HttpStatus.OK,
      message: 'Se han creado las tallas exittosamente',
    };
  }
}
