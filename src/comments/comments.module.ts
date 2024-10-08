import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Content } from '../content/entities/content.entity'; // Importar la entidad Content
import { User } from '../Auth/entities/user.entity'; // Importar la entidad User

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Content, User]), // Incluir Comment, Content y User en el módulo
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}