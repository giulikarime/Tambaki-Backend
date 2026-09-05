import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { RegisterSupplierDto } from "./register-supplier.dto";
import { SuppliersService } from "./suppliers.service";
import { UpdateSupplierDto } from "./update-supplier.dto";

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    async register(@Body() dto: RegisterSupplierDto) {
        return this.suppliersService.create(dto);
    }

    @Get()
    async findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSupplierDto: UpdateSupplierDto
    ) {
        return this.suppliersService.update(id, updateSupplierDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.delete(id);
    }
}