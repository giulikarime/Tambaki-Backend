// src/uploads/uploads.module.ts
import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}