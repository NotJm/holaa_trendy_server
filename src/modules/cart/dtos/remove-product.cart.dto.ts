import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RemoveProducToCartDto {
  @IsNotEmpty({ message: 'El identificador del usuario es requerido' })
  @IsUUID('all', { message: 'El identificador del usuario deberia ser UUID' })
  @IsString({ message: 'El identificador del usuario deberia ser texto' })
  userId: string;

  @IsNotEmpty({ message: "El codigo del producto es requerido" })
  @IsString({ message: "El codigo del producto deberia ser texto" })
  productCode: string;
}
