import { Module } from '@nestjs/common';
import { SaleModule } from 'src/modules/sales/sale.module';
import { ProductModule } from '../product.module';
import { RecommendationService } from './recommendations.service';
import { HttpModule } from '@nestjs/axios';
import { RecommendationController } from './recommendations.controller';

@Module({
  imports: [HttpModule, SaleModule, ProductModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
