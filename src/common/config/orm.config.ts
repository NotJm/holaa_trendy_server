import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RefreshToken } from 'src/modules/auth/entity/refresh-token.entity';
import { BestOffers } from 'src/modules/products/entity/best-offers.entity';
import { BestSellers } from 'src/modules/products/entity/best-sellers.entity';
import { NewArrivals } from 'src/modules/products/entity/new-arrivals.entity';
import { ProductVariant } from 'src/modules/products/entity/product-variant.entity';
import { User } from 'src/modules/users/entity/users.entity';
import { Audit } from '../../modules/audit/entity/audit.entity';
import { CartItem } from '../../modules/cart/entity/cart-item.entity';
import { Cart } from '../../modules/cart/entity/cart.entity';
import { Category } from '../../modules/categories/entity/category.entity';
import { CategorySaleTrend } from '../../modules/categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../../modules/categories/entity/category_stock_initial.entity';
import { Color } from '../../modules/colors/entity/colors.entity';
import { ProductImages } from '../../modules/products/entity/products-images.entity';
import { Product } from '../../modules/products/entity/products.entity';
import { SaleHistory } from '../../modules/sales/entity/sale-history.entity';
import { SaleItem } from '../../modules/sales/entity/sale-item.entity';
import { Sale } from '../../modules/sales/entity/sale.entity';
import { StockDepletionTime } from '../../modules/sales/entity/stock-depletion-time.entity';
import { Size } from '../../modules/sizes/entity/sizes.entity';
import { SubCategory } from '../../modules/sub-categories/entity/sub-categories.entity';
import { Address } from '../../modules/users/entity/user-address.entity';
import { Incident } from '../../modules/users/entity/user-incident.entity';
import { WishListItem } from '../../modules/wishlist/entity/wishlist-item.entity';
import { Wishlist } from '../../modules/wishlist/entity/wishlist.entity';

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
    // Entidades

    // Users
    User,
    Address,
    Incident,
    RefreshToken,
    Cart,
    CartItem,
    Wishlist,
    WishListItem,


    // Products
    Product,
    Category,
    SubCategory,
    Size,
    Color,
    ProductImages,
    ProductVariant,

    // Administration
    Sale,
    SaleHistory,
    SaleItem,
    Audit,

    // Vistas Materializadas
    NewArrivals,
    BestOffers,
    BestSellers,
    CategoryStockInitial,
    CategorySaleTrend,
    StockDepletionTime,
    
  ],
  synchronize: true,
});
