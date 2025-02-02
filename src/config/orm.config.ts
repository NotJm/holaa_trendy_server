import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RefreshToken } from '../auth/schemas/refresh-token.entity';
import { Cart } from '../cart/entity/cart.entity';
import { Category } from '../categories/entity/category.entity';
import { Colors } from '../colors/entity/colors.entity';
import { Products } from '../products/entity/products.entity';
import { Sizes } from '../sizes/entity/sizes.entity';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { Incidents } from '../users/entity/incidents.entity';
import { Address } from '../users/entity/user-address.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { Users } from '../users/entity/users.entity';

export const ormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    Users,
    Address,
    UserOtp,
    RefreshToken,
    Incidents,
    Products,
    Category,
    SubCategory,
    Sizes,
    Colors,
    Cart
  ],
  synchronize: true,
  
});
