import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../user/user.service';
import { User } from '../Auth/entities/user.entity';
import { UsersController } from './user.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should find all users', async () => {
    const result = [
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' },
    ];

    mockUsersService.findAll.mockResolvedValue(result);

    expect(await usersController.findAll()).toEqual(result);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should find one user', async () => {
    const id = '1';
    const result = { id: 1, username: 'user1', email: 'user1@example.com' };
    
    mockUsersService.findOne.mockResolvedValue(result);

    expect(await usersController.findOne(id)).toEqual(result);
    expect(mockUsersService.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a user', async () => {
    const id = 1;
    const user = { username: 'updatedUser', email: 'updated@example.com' };
    const result = { id, ...user };
    
    mockUsersService.update.mockResolvedValue(result);

    expect(await usersController.update(id, user)).toEqual(result);
    expect(mockUsersService.update).toHaveBeenCalledWith(id, user);
  });

  it('should remove a user', async () => {
    const id = 1;
    const result = { id, username: 'user1', email: 'user1@example.com' };
    
    mockUsersService.remove.mockResolvedValue(result);

    expect(await usersController.remove(id)).toEqual(result);
    expect(mockUsersService.remove).toHaveBeenCalledWith(id);
  });
});
