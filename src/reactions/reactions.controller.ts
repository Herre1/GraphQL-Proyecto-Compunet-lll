import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('api/v1/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.create(createReactionDto);
  }

  @Get()
  findAll() {
    return this.reactionsService.findAll();
  }

  @Get('comment/:id')
  findByComment(@Param('id') commentId: string) {
    return this.reactionsService.findByComment(commentId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reactionsService.findByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionsService.remove(id);
  }

  // Nuevo endpoint para obtener el conteo de reacciones (likes y dislikes) de un comentario específico
  @Get('count/:commentId')
  async countReactionsByComment(@Param('commentId') commentId: string) {
    return this.reactionsService.countReactionsByComment(commentId);
  }
}