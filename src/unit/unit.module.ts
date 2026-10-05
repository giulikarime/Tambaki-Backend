import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}