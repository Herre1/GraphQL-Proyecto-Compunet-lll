import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './Auth/entities/user.entity';
import { List } from './list/entity/list.entity';
import { Content } from './content/entities/content.entity';
import { ListModule } from './list/list.module';
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
    AuthModule, UsersModule, ContentModule,AuthModule,CommentsModule, ListModule
  ],
})
export class AppModule {}