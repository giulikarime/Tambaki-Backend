import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.tagsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}