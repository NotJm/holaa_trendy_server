import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterIncidentDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class CloseIncidentDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}