import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateCmvPlanningDto } from './create-cmv-planning.dto';
import { CmvPlanningService } from './cmv-planning.service';

type AuthenticatedRequest = Request & { user?: { sub: number } };

@Controller('cmv-planning')
export class CmvPlanningController {
  constructor(private readonly cmvPlanningService: CmvPlanningService) {}

  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    return this.cmvPlanningService.findForUser(this.getUserId(request), year);
  }

  @Post()
  save(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateCmvPlanningDto,
  ) {
    return this.cmvPlanningService.saveForUser(this.getUserId(request), dto);
  }

  private getUserId(request: AuthenticatedRequest) {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Autenticação necessária.');
    }
    return userId;
  }
}
