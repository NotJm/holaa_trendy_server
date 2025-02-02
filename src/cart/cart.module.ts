import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
