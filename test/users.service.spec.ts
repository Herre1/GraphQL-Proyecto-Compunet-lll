import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { Repository } from 'typeorm';


describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const testUuid = '123e4567-e89b-12d3-a456-426614174000';

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          id: testUuid,
          fullName: 'Test User',
          email: 'test@test.com',
          isActive: true,
          roles: ['user'],
        },
      ];

      mockRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const expectedUser = {
        id: testUuid,
        fullName: 'Test User',
        email: 'test@test.com',
        isActive: true,
        roles: ['user'],
      };

      mockRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.findOne(testUuid);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: testUuid });
    });
  });



});