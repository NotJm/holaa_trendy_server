import { IsString } from 'class-validator';

export class UpdatePolicyDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}
