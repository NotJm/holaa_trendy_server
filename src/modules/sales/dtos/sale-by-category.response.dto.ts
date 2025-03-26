import { Expose } from "class-transformer";

export class SaleByCategoryResponseDto {
  @Expose()
  categoryName: string

  @Expose()
  productCode: string

  @Expose()
  productName: string

  @Expose()
  productImage: string

  @Expose()
  stockInitial: number

  @Expose()
  registerSale: Date

  @Expose()
  saleQuantity: number;

}
