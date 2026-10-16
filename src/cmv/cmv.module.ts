import { Module } from '@nestjs/common';
import { CmvController } from './cmv.controller';
import { CmvService } from './cmv.service';

@Module({
  controllers: [CmvController],
  providers: [CmvService],
})
export class CmvModule {}