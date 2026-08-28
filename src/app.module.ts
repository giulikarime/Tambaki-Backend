import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module'
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, OrdersModule, ReservationsModule, ConfigModule.forRoot({ isGlobal: true }), TablesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
