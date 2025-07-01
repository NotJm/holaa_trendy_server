import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CreateColorDto, CreateManyColorsDto } from './dtos/create.color.dto';
import { UpdateColorDto, UpdateManyColorsDto } from './dtos/update.color.dto';
import { Color } from './entity/colors.entity';

@Injectable()
export class ColorsService extends BaseService<Color> {
  constructor(
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
  ) {
    super(colorsRepository);
  }

  public async findColorByName(name: string): Promise<Color> {
    return await this.findOne({
      where: { name: name },
    });
  }

  public async existsColorByName(name: string): Promise<boolean> {
    const color = this.findOne({
      where: { name: name }
    })

    return !!color;
  }

  public async findColorsByNames(names: string[]): Promise<Color[]> {
    return await this.find({
      where: { name: In(names) },
    });
  }

  public async createOne(createColorDto: CreateColorDto): Promise<Color> {
    const { name } = createColorDto;

    const existsColor = await this.findColorByName(name);

    if (existsColor) {
      throw new ConflictException(
        `El color con el nombre ${existsColor.name} ya existe`,
      );
    }

    const createColor = await this.create(createColorDto);

    return createColor;
  }

  public async createMany(
    createManyColorsDto: CreateManyColorsDto,
  ): Promise<any> {
    const { colors } = createManyColorsDto;

    const createColors = await Promise.all(
      colors.map(async (color) => {
        return await this.createOne(color);
      }),
    );

    return createColors;
  }

  public async getColors(): Promise<Color[]> {
    return await this.findAll()
  }

  public async updateOne(updateColorDto: UpdateColorDto): Promise<Color> {
    const { id, newName, newHexCode: newHexColor } = updateColorDto;

    const color = await this.findById(id);

    if (!color) {
      throw new NotFoundException(
        `El color con el identificador ${id} no se encontro`,
      );
    }

    if (newName) {
      const existsColorWithName = await this.findColorByName(newName);

      if (existsColorWithName) {
        throw new ConflictException(
          `El color con el nombre ${newName} ya existe`,
        );
      }
      
      color.name = newName;
    }

    if (newHexColor) {
      color.hexCode = newHexColor;
    }

    return await this.update(id, color);
  }

  public async updateMany(
    updateManyColorsDto: UpdateManyColorsDto,
  ): Promise<Color[]> {
    const { colors } = updateManyColorsDto;

    const updateColors = await Promise.all(
      colors.map(async (color) => {
        return await this.updateOne(color);
      }),
    );

    return updateColors;
  }

  public async deleteOne(id: string): Promise<Color> {
    return await this.deleteById(id);
  }

  public async deleteMany(ids: string[]): Promise<Color[]> {
    const deleteColors = await Promise.all(
      ids.map(async (id) => {
        return await this.deleteOne(id);
      })
    )
    return deleteColors;
  }


}
