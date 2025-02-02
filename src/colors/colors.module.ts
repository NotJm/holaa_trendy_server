import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colors } from './entity/colors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colors])],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
