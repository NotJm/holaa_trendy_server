import { Injectable } from '@nestjs/common';
import {
  FeaturedProductResponseDto,
  toFeaturedProductResponseDto,
} from '../dtos/product.response.dto';
import { SaleService } from '../../../modules/sales/sale.service';
import { ProductService } from '../product.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
  ) {}

  #API: string = 'https://backend-microservice.eyjlaq.easypanel.host/recommend';

  private async getRecomenderProducts(
    productCode: string,
    nItems: number = 5,
  ): Promise<string[]> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.#API}/${productCode}?n_items=${nItems}`),
    );

    return response.data.recomendations;
  }

  async getRecommenderProducts(userId: string): Promise<{
    productName: string;
    products: FeaturedProductResponseDto[];
  }> {
    const sale = await this.saleService.findSaleByUserId(userId);
    if (!sale) return { productName: '', products: [] };

    const productCode = sale.saleItems[0].product.code;

    const codes = await this.getRecomenderProducts(productCode, 5);

    const productBought =
      await this.productService.findProductByCode(productCode);

    const products = await this.productService.findProductsByCodes(codes);

    return {
      productName: productBought.name,
      products: products.map((product) =>
        toFeaturedProductResponseDto(product),
      ),
    };
  }
}
