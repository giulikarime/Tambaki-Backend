import { Controller } from '@nestjs/common'
import { CostsService } from './costs.service'
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateCostDto } from './create-costs.dto'
import { UpdateCostDto } from './update-costs.dto'


@Controller('costs')
export class CostsController {
  constructor(private readonly costsService: CostsService) { }

  @Post()
  create(@Body() createCostDto: CreateCostDto) {
    return this.costsService.create(createCostDto)
  }

  @Get()
  findAll() {
    return this.costsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCostDto: UpdateCostDto) {
    return this.costsService.update(+id, updateCostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costsService.remove(+id)
  }
}