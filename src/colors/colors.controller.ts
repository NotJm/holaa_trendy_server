import { Body, Controller, Post } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateManyColorsDto } from './dtos/create.color.dto';

@Controller('colors')
export class ColorsController {

  constructor(private readonly colorsService: ColorsService) {}

  @Post('create-many')
  async createSizes(@Body() createColorsDto: CreateManyColorsDto) {
    return await this.colorsService.createManySizes(createColorsDto);
  }
}
