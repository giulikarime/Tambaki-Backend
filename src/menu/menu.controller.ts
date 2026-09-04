import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param,ParseIntPipe, Patch, Post} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './create-menu.dto';
import { UpdateMenuDto } from './update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }

  @Post(':id/tags/:tagId')
  @HttpCode(HttpStatus.CREATED)
  async addTag(@Param('id', ParseIntPipe) id: number, @Param('tagId', ParseIntPipe) tagId: number) {
    return this.menuService.addTag(id, tagId);
  }

  @Delete(':id/tags/:tagId')
  async removeTag(@Param('id', ParseIntPipe) id: number, @Param('tagId', ParseIntPipe) tagId: number) {
    return this.menuService.removeTag(id, tagId);
  }
}