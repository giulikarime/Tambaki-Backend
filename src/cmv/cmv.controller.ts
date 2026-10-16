import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CmvService } from './cmv.service';
import { CreateCmvEntryDto } from './create-cmv-entry.dto';
import { CmvQueryDto } from './cmv-query.dto';

@Controller('cmv')
export class CmvController {
  constructor(private readonly cmvService: CmvService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCmvEntryDto) {
    return this.cmvService.create(dto);
  }

  @Get('summary')
  summary(@Query() query: CmvQueryDto) {
    return this.cmvService.summary(query);
  }

  @Get()
  findAll(@Query() query: CmvQueryDto) {
    return this.cmvService.findAll(query);
  }
}