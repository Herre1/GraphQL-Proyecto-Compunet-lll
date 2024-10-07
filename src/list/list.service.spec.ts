import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entity/list.entity';
import { User } from '../auth/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { NotFoundException } from '@nestjs/common';

describe('ListService', () => {
  let service: ListService;
  let listRepository: Repository<List>;
  let userRepository: Repository<User>;
  let contentRepository: Repository<Content>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(List),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Content),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    contentRepository = module.get<Repository<Content>>(getRepositoryToken(Content));
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const mockUser = { id: 'user-id' } as User;
      const mockContents = [{ id: 'content-id' }] as Content[];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(contentRepository, 'findByIds').mockResolvedValue(mockContents);
      jest.spyOn(listRepository, 'create').mockReturnValue({} as List);
      jest.spyOn(listRepository, 'save').mockResolvedValue({} as List);

      const createListDto = {
        userId: 'user-id',
        contentIds: ['content-id'],
        status: 'completed',
      };

      const result = await service.create(createListDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createListDto.userId } });
      expect(contentRepository.findByIds).toHaveBeenCalledWith(createListDto.contentIds);
      expect(listRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        contents: mockContents,
        status: createListDto.status,
      });
      expect(listRepository.save).toHaveBeenCalledWith({});
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const createListDto = {
        userId: 'invalid-user-id',
        contentIds: ['content-id'],
        status: 'completed',
      };

      await expect(service.create(createListDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if content not found', async () => {
      const mockUser = { id: 'user-id' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(contentRepository, 'findByIds').mockResolvedValue([]);

      const createListDto = {
        userId: 'user-id',
        contentIds: ['invalid-content-id'],
        status: 'completed',
      };

      await expect(service.create(createListDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return lists for a user', async () => {
      const mockLists = [{ id: 'list-id', status: 'completed' }] as List[];

      jest.spyOn(listRepository, 'find').mockResolvedValue(mockLists);

      const userId = 'user-id';
      const result = await service.findByUser(userId);

      expect(listRepository.find).toHaveBeenCalledWith({ where: { user: { id: userId } } });
      expect(result).toEqual(mockLists);
    });
  });
});