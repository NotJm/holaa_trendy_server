import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
