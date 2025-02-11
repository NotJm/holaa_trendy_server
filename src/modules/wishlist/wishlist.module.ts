import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
