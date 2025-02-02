import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CreateManyColorsDto } from './dtos/create.color.dto';
import { Colors } from './entity/colors.entity';

@Injectable()
export class ColorsService extends BaseService<Colors> {
  constructor(
    @InjectRepository(Colors)
    private readonly colorsRepository: Repository<Colors>,
  ) {
    super(colorsRepository);
  }

  async findColorByID(color: string): Promise<Colors> {
    return await this.findOne({
      where: { color: color },
    });
  }

  async findColorsByIDs(colors: string[]): Promise<Colors[]> {
    return await this.find({
      where: { color: In(colors) },
    });
  }

  public async createManySizes(
    createManyColorsDto: CreateManyColorsDto,
  ): Promise<any> {
    for (const createColorDto of createManyColorsDto.colors) {
      const { color: id } = createColorDto;

      const existsSize = await this.findColorByID(id);

      if (existsSize) {
        throw new ConflictException('Ya existe un color con ese ID');
      }

      await this.create(createColorDto);
    }

    return {
      status: HttpStatus.OK,
      message: 'Se han creado las colores exittosamente',
    };
  }
}
