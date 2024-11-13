import { Resolver, Query } from '@nestjs/graphql';
import { User } from '../Auth/entities/user.entity';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  getUsers() {
    return this.usersService.findAll();
  }
}
