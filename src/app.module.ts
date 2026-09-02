import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrdersModule,
    ReservationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TablesModule,
    UsersModule,
    ProductsModule,
    SuppliersModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
