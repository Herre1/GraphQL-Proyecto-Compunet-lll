import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { User } from '../Auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUserRepository = {
  findOne: jest.fn().mockResolvedValue({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword123',
    roles: ['user'],
  }),
  save: jest.fn(),
};

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return a user when findOne is called', async () => {
    const user = await userService.findOne('123e4567-e89b-12d3-a456-426614174000');
    expect(user).toEqual({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      password: 'hashedPassword123',
      roles: ['user'],
    });
  });
});