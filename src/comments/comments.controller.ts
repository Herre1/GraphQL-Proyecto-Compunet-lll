import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth(ValidRoles.user) // Solo usuarios autenticados pueden crear comentarios
  create(
    @Body('contentId') contentId: string,
    @Body('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(createCommentDto, userId, contentId);
  }

  @Get()
  @Auth() // Ruta abierta para todos los usuarios autenticados
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @Auth() // Ruta abierta para todos los usuarios autenticados
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post('reply/:id')
  @Auth(ValidRoles.user) // Solo usuarios autenticados pueden responder a comentarios
  replyToComment(
    @Param('id') parentCommentId: string,
    @Body('userId') userId: string,
    @Body('contentId') contentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.replyToComment(parentCommentId, createCommentDto, userId, contentId);
  }

  @Get('parent/:id')
  @Auth() // Ruta abierta para todos los usuarios autenticados
  findReplies(@Param('id') parentCommentId: string) {
    return this.commentsService.findReplies(parentCommentId);
  }

  @Patch(':id')
  @Auth(ValidRoles.user, ValidRoles.admin) // Usuarios autenticados o admin pueden actualizar
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin) // Solo admin puede eliminar comentarios
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}