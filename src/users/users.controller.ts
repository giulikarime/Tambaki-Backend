import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './register-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	async findAll() {
		return this.usersService.findAll();
	}

	@Post()
	async registerUser(@Body() dto: RegisterUserDto) {
		return this.usersService.registerUser(dto);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateUserDto,
	) {
		return this.usersService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.delete(id);
	}
}