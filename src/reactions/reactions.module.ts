import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { Reaction } from './entities/reaction.entity';
import { User } from '../Auth/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, User, Comment]), AuthModule],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}