import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { Content } from './content/entities/content.entity';
import { List } from './list/entity/list.entity';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.URL,
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([User, List, Content]),
    AuthModule, UsersModule, ContentModule,CommentsModule,ReactionsModule
  ],
})
export class AppModule {}