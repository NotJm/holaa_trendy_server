export class CreateColorsDto {
  color: string;
  description: string;
}

export class CreateManyColorsDto {
  colors: CreateColorsDto[];
}