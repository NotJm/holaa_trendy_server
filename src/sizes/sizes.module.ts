import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';
import { Module } from '@nestjs/common';
import { Sizes } from './entity/sizes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sizes])],
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
