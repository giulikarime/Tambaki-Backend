import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CmvPlanningController } from './cmv-planning.controller';
import { CmvPlanningService } from './cmv-planning.service';

@Module({
  controllers: [CmvPlanningController],
  providers: [CmvPlanningService, PrismaService],
})
export class CmvPlanningModule {}
