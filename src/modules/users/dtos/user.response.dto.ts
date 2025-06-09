import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../entity/users.entity';

export class UserResponseDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;
}

export function toUserResponseDto(user: User): UserResponseDto {
  return plainToInstance(UserResponseDto, {
    username: user.username,
    email: user.email,
    avatar: `https://ui-avatars.com/api/?name=${user.username}`,
  });
}
