import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List } from './entity/list.entity';
import { User } from '../auth/entities/user.entity';
import { Content } from '../content/entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, User, Content])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}