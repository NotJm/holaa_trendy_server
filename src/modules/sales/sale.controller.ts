import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { User } from '../../common/decorators/user.decorator';
import { BaseController } from '../../common/base.controller';
import { IApiResponse } from 'src/common/interfaces/api.response.interface';
import { SaleService } from './sale.service';
import { ROLE } from '../../common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { CategoryId } from 'src/common/decorators/category.decorator';
import { SaleByCategoryResponseDto } from './dtos/sale-by-category.response.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard, RoleGuard)
export class SaleController extends BaseController {
  constructor(private readonly saleService: SaleService) {
    super();
  }

  @Post('add')
  @Roles(ROLE.USER)
  async add(@User() userId: string): Promise<IApiResponse> {
    try {
      const cart = await this.saleService.add(userId);

      return {
        status: HttpStatus.OK,
        message: 'Su producto llegara a su domicilio',
        data: {
          cart: cart,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('stock-depletion')
  @Roles(ROLE.ADMIN)
  async getStockDepletion(): Promise<IApiResponse> {
    try {
      const stockData = await this.saleService.getStockDepletion();

      return {
        status: HttpStatus.OK,
        data: stockData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('by-category/:category')
  @Roles(ROLE.ADMIN)
  async getSalesByCategory(
    @CategoryId() category: string,
  ): Promise<IApiResponse> {
    try {
      const sales = await this.saleService.getSalesByCategory(category);
      

      return {
        status: HttpStatus.OK,
        data: sales,
      };

    } catch (error) {
      return this.handleError(error);
    }
  }
}
