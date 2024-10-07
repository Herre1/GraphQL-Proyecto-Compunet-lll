import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { CreateListDto } from '../list/dtos/create-list.dto';
import { User as UserEntity } from '../Auth/entities/user.entity';
import { List } from './entity/list.entity'; // Ajusta el path según la estructura de tu proyecto

describe('ListController', () => {
  let controller: ListController;
  let service: ListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: {
            create: jest.fn(),
            findByUser: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>(ListService);
  });

  describe('create', () => {
    it('should create a new list', async () => {
      const createListDto: CreateListDto = {
        userId: 'user-id',
        contentIds: ['content-id'],
        status: 'completed',
      };

      const mockList = { id: 'list-id', status: 'completed' };
      jest.spyOn(service, 'create').mockResolvedValue(mockList as any);

      const result = await controller.create(createListDto);

      expect(result).toEqual(mockList);
      expect(service.create).toHaveBeenCalledWith(createListDto);
    });
  });

  describe('getListsByUser', () => {
    it('should return lists by user', async () => {
      const mockLists = [
        {
          id: 'list-id',
          status: 'completed',
          user: { id: 'user-id' },  // Mock de user
          contents: [{ id: 'content-id' }]  // Mock de contents
        }
      ] as List[];
  
      jest.spyOn(service, 'findByUser').mockResolvedValue(mockLists);
  
      const userId = 'user-id';
      const result = await controller.getListsByUser(userId);
  
      expect(result).toEqual(mockLists);
      expect(service.findByUser).toHaveBeenCalledWith(userId);
    });
  });
  

  describe('remove', () => {
    it('should remove a list', async () => {
      const listId = 'list-id';
      const mockUser = { id: 'user-id' } as UserEntity;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(listId, mockUser);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(listId, mockUser.id);
    });
  });
});
