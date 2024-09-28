import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.create(createReactionDto);
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
}