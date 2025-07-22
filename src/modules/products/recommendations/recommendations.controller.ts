import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendations.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/constants/contants';
import { UserId } from 'src/common/decorators/user.decorator';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { BaseController } from 'src/common/base.controller';

@Controller('recommendations')
export class RecommendationController extends BaseController {
  constructor(private readonly recommendationService: RecommendationService) {
    super();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER)
  @Get()
  public async getRecommenderProducts(
    @UserId() userId: string,
  ): Promise<IApiResponse> {
    try {
      const data =
        await this.recommendationService.getRecommenderProducts(userId);

      return {
        status: HttpStatus.OK,
        message: 'Productos recomendados recuperados exitosamente',
        data: {
          productName: data.productName,
          products: data.products,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
