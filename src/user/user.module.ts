import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller'; // Si deseas mantener el controlador REST
import { UsersService } from './user.service';
import { User } from '../Auth/entities/user.entity';
import { UserResolver } from './user.resolver'; // Importa el resolver

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // Si deseas mantener el controlador REST
  providers: [UsersService, UserResolver], // Agrega el resolver
})
export class UsersModule {}
