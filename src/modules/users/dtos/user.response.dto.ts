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
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  avatar: string;
}

export function toUserProfileResponseDto(user: User): UserProfileResponseDto {
  return plainToInstance(UserProfileResponseDto, {
    id: `${user.username.substring(0, 2).toUpperCase()}-${user.id.substring(0,5)}`,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: `https://ui-avatars.com/api/?name=${user.username}`,
  });
}
