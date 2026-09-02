import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';

@Module({
    controllers: [SuppliersController],
    providers: [SuppliersService, PrismaService],
})
export class SuppliersModule { }