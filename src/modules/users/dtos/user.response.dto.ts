import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../entity/users.entity';
import { ACCOUNT_STATE } from 'src/common/constants/contants';

export class UserManagmentResponseDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  state: ACCOUNT_STATE;

  @Expose()
  createdAt: Date;

  

}

export class UserProfileResponseDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;
}

export function toUserProfileResponseDto(user: User): UserProfileResponseDto {
  return plainToInstance(UserProfileResponseDto, {
    username: user.username,
    email: user.email,
    avatar: `https://ui-avatars.com/api/?name=${user.username}`,
  });
}
