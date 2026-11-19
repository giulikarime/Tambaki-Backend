import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CostsController } from './costs.controller'
import { CostsService } from './costs.service'

@Module({
  controllers: [CostsController],
  providers: [CostsService, PrismaService],
})
export class CostsModule { }