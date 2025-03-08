import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../../common/base.controller';
import { ROLE } from '../../common/constants/contants';
import { ProductCode } from '../../common/decorators/product.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { IApiResponse } from '../../common/interfaces/api.response.interface';
import { WishlistService } from './wishlist.service';


@Controller('wishlist')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.USER)
export class WishlistController extends BaseController {
  constructor(private readonly wishListService: WishlistService) {
    super();
  }

  @Post('add/:productCode')
  async addProduct(
    @User() userId: string,
    @ProductCode() productCode: string,
  ): Promise<IApiResponse> {
    try {
      await this.wishListService.addProduct(userId, productCode);

      return {
        status: HttpStatus.OK,
        message: 'Añadido a la lista de deseos',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  async getWishList(@User() userId: string): Promise<IApiResponse> {
    try {
      const wishList = await this.wishListService.getWishList(userId);

      return {
        status: HttpStatus.OK,
        message: '',
        data: {
          wishList: wishList,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put('remove/:productCode')
  async removeProductCode(
    @User() userId: string,
    @ProductCode() productCode: string,
  ): Promise<IApiResponse> {
    try {
      await this.wishListService.removeProduct(userId, productCode);

      return {
        status: HttpStatus.OK,
        message: 'Producto quitado de la lista de deseos',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
