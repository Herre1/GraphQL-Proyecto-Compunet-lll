import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from '../list/dtos/create-list.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('api/v1/lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @Auth(ValidRoles.user)  // Solo usuarios pueden crear listas
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get(':userId')
  @Auth(ValidRoles.user)
  getListsByUser(@Param('userId') userId: string) {
    return this.listService.findByUser(userId);
  }
  
}