import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from '../list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entity/list.entity';
import { User } from '../../Auth/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const user = new User();
      user.id = 'test-user-id';

      const content = new Content();
      content.id = 'test-content-id';

      const createListDto = {
        userId: 'test-user-id',
        contentIds: ['test-content-id'],
        status: 'completed',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(contentRepository, 'findByIds').mockResolvedValue([content]);
      jest.spyOn(listRepository, 'create').mockReturnValue(new List());
      jest.spyOn(listRepository, 'save').mockResolvedValue(new List());

      const result = await service.create(createListDto);

      expect(result).toBeInstanceOf(List);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createListDto.userId } });
      expect(contentRepository.findByIds).toHaveBeenCalledWith(createListDto.contentIds);
      expect(listRepository.create).toHaveBeenCalledWith({
        user,
        contents: [content],
        status: createListDto.status,
      });
      expect(listRepository.save).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const createListDto = {
        userId: 'invalid-user-id',
        contentIds: ['test-content-id'],
        status: 'completed',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createListDto)).rejects.toThrow('User with ID invalid-user-id not found');
    });
  });
});
