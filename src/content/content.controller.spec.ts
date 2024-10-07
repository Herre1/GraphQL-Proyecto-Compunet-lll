import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentType } from './enums/content-type.enum';

describe('ContentController', () => {
  let contentController: ContentController;
  let contentService: ContentService;

  const mockContentService = {
    findAll: jest.fn(() => ['test']),
    findOne: jest.fn((id: string) => ({ id, title: 'Test Content' })),
    create: jest.fn((dto: CreateContentDto) => ({
      id: '1',
      ...dto,
    })),
    update: jest.fn((id: string, dto: UpdateContentDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: mockContentService,
        },
      ],
    }).compile();

    contentController = module.get<ContentController>(ContentController);
    contentService = module.get<ContentService>(ContentService);
  });

  describe('findAll', () => {
    it('should return an array of content', async () => {
      const result = await contentController.findAll();
      expect(result).toEqual(['test']);
      expect(contentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a content by id', async () => {
      const result = await contentController.findOne('1');
      expect(result).toEqual({ id: '1', title: 'Test Content' });
      expect(contentService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new content', async () => {
      const createContentDto: CreateContentDto = {
        title: 'Inception',
        genre: ['Sci-Fi', 'Thriller'],
        year: 2010,
        actors: ['Leonardo DiCaprio'],
        description: 'A thief who steals corporate secrets.',
        type: ContentType.MOVIE,
        director: 'Christopher Nolan',
        rating: 8.8,
      };

      const result = await contentController.create(createContentDto);
      expect(result).toEqual({ id: '1', ...createContentDto });
      expect(contentService.create).toHaveBeenCalledWith(createContentDto);
    });
  });

  describe('update', () => {
    it('should update an existing content', async () => {
      const updateContentDto: UpdateContentDto = {
        title: 'Inception Updated',
      };

      const result = await contentController.update('1', updateContentDto);
      expect(result).toEqual({ id: '1', ...updateContentDto });
      expect(contentService.update).toHaveBeenCalledWith('1', updateContentDto);
    });
  });

  describe('remove', () => {
    it('should remove a content by id', async () => {
      const result = await contentController.remove('1');
      expect(result).toEqual({ id: '1' });
      expect(contentService.remove).toHaveBeenCalledWith('1');
    });
  });
});
