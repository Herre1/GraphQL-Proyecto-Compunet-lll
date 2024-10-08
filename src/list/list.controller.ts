import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from '../list/dtos/create-list.dto';
import { Auth } from '../Auth/decorators/auth.decorator';
import { ValidRoles } from '../Auth/interfaces/valid-roles';
import { GetUser } from '../Auth/decorators/get-user/get-user.decorator'; // Importa el decorador correcto
import { User as UserEntity} from '../Auth/entities/user.entity'


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

  @Delete(':id')
  @Auth(ValidRoles.user)  // Solo usuarios autenticados pueden eliminar sus listas
  remove(@Param('id') listId: string, @GetUser() user: UserEntity) { // Usa el decorador para obtener el usuario
    return this.listService.remove(listId, user.id);
  }
}
