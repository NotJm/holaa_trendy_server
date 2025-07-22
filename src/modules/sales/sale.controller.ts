import { Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CategoryId } from 'src/common/decorators/category.decorator';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { BaseController } from '../../common/base.controller';
import { ROLE } from '../../common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserId } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { SaleService } from './sale.service';

@Controller('sales')
@UseGuards(JwtAuthGuard, RoleGuard)
export class SaleController extends BaseController {
  constructor(private readonly saleService: SaleService) {
    super();
  }

  @Post('add')
  @Roles(ROLE.USER)
  async add(@UserId() userId: string): Promise<IApiResponse> {
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

  @Get('count/today')
  @Roles(ROLE.ADMIN)
  public async getCountSaleToday(): Promise<IApiResponse> {
    try {
      const count = await this.saleService.getCountSalesToday();

      return {
        status: HttpStatus.OK,
        data: count,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('income/today')
  @Roles(ROLE.ADMIN)
  public async getIncomeToday(): Promise<IApiResponse> {
    try {
      const income = await this.saleService.getIncomeToday();

      return {
        status: HttpStatus.OK,
        data: income,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('ranking')
  @Roles(ROLE.ADMIN)
  public async getRankingProducts(): Promise<IApiResponse> {
    try {
      const top = await this.saleService.getRankingProducts();

      return {
        status: HttpStatus.OK,
        data: top,
      };
      
    } catch (error) {
      return this.handleError(error);
    }
  }
}
