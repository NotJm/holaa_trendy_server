export class CreateSizeDto {
  size: string;
  description: string;
}

export class CreateManySizesDto {
  sizes: CreateSizeDto[];
}