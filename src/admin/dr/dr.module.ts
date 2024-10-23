import { MongooseModule } from '@nestjs/mongoose';
import { DrController } from './dr.controller';
import { DrService } from './dr.service';
import { Module } from '@nestjs/common';
import { Dr, DrSchema } from './schemas/dr.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
            name: Dr.name,
            schema: DrSchema
        }
    ])
  ],
  controllers: [DrController],
  providers: [DrService],
})
export class DrModule {}
