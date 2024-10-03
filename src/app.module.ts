import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.URL,
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),

     CommonModule, AuthModule, UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
