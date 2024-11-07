import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Content } from '../content/entities/content.entity';
import { User } from '../Auth/entities/user.entity';
import { ReactionsModule } from '../reactions/reactions.module'; // Importar el módulo de reacciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Content, User]),
    ReactionsModule, // Asegúrate de importar ReactionsModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
