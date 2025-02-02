import { Body, Controller, Post } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { CreateManySizesDto } from './dtos/create.size.dto';

@Controller('sizes')
export class SizesController {

  constructor(private readonly sizesService: SizesService) {}

  @Post('create-many')
  async createSizes(@Body() createSizesDto: CreateManySizesDto) {
    return await this.sizesService.createManySizes(createSizesDto);
  }

}
