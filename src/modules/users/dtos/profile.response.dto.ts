import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../entity/users.entity';

export class ProfileResponseDto {
  @Expose()
  address: string;

  @Expose()
  postCode: string;

  @Expose()
  state: string;

  @Expose()
  municipality: string;

  @Expose()
  town: string;

  @Expose()
  colony: string;

  @Expose()
  description: string;
  

}

export function toProfileResponseDto(user: User): ProfileResponseDto {
  return plainToInstance(ProfileResponseDto, {
    address: user.address?.address || '',
    postCode: user.address?.postCode || '',
    state: user.address?.state || '',
    municipality: user.address?.municipality || '',
    town: user.address?.town || '',
    colony: user.address?.colony || '',
    description: user.address?.description || '',
  });
}