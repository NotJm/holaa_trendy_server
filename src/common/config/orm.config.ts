import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entity/users.entity';
import { RefreshToken } from '../../modules/auth/entity/refresh-token.entity';
import { CartItem } from '../../modules/cart/entity/cart-item.entity';
import { Cart } from '../../modules/cart/entity/cart.entity';
import { Category } from '../../modules/categories/entity/category.entity';
import { Color } from '../../modules/colors/entity/colors.entity';
import { ProductImages } from '../../modules/products/entity/products-images.entity';
import { Product } from '../../modules/products/entity/products.entity';
import { PurchaseHistory } from '../../modules/purchase/entity/purchase-history.entity';
import { ShippingHistory } from '../../modules/shipping/entity/shipping-history.entity';
import { Shipping } from '../../modules/shipping/entity/shipping.entity';
import { Size } from '../../modules/sizes/entity/sizes.entity';
import { SubCategory } from '../../modules/sub-categories/entity/sub-categories.entity';
import { Incidents } from '../../modules/users/entity/incidents.entity';
import { Address } from '../../modules/users/entity/user-address.entity';
import { UserOtp } from '../../modules/users/entity/user-otp.entity';
import { Wishlist } from '../../modules/wishlist/entity/wishlist.entity';
import { Sale } from '../../modules/sales/entity/sale.entity';
import { SaleHistory } from '../../modules/sales/entity/sale-history.entity';
import { SaleItem } from '../../modules/sales/entity/sale-item.entity';
import { Purchase } from '../../modules/purchase/entity/purchase.entity';
import { PurchaseItem } from '../../modules/purchase/entity/purchase-item.entity';
import { Supplier } from '../../modules/suppliers/entity/suppliers.entity';
import { SupplierEvaluation } from '../../modules/suppliers/entity/suppliers-evaluations.entity';
import { SupplierProduct } from '../../modules/suppliers/entity/suppliers-products.entity';
import { NewArrivals } from 'src/modules/products/entity/new-arrivals.entity';
import { BestOffers } from 'src/modules/products/entity/best-offers.entity';
import { BestSellers } from 'src/modules/products/entity/best-sellers.entity';

export const ormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  retryAttempts: 1,
  entities: [
    User,
    Address,
    UserOtp,
    RefreshToken,
    Incidents,
    Product,
    Category,
    SubCategory,
    Size,
    Color,
    Cart,
    ProductImages,
    CartItem,
    Shipping,
    ShippingHistory,
    PurchaseHistory,
    Wishlist,
    Sale,
    SaleHistory,
    SaleItem,
    Purchase,
    PurchaseItem,
    Supplier,
    SupplierEvaluation,
    SupplierProduct,
    NewArrivals,
    BestOffers,
    BestSellers
  ],
  synchronize: false,
  // logging: true,
  
});
