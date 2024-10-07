import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { CreateContentDto } from 'src/content/dto/create-content.dto';
import { Content } from 'src/content/entities/content.entity';
import { ContentType } from 'src/content/enums/content-type.enum';


describe('ContentService', () => {
  let service: ContentService;
  let repository: Repository<Content>;

  const testUuid = '123e4567-e89b-12d3-a456-426614174000';

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Content),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get<Repository<Content>>(getRepositoryToken(Content));
  });

  describe('create', () => {
    it('should create and return content', async () => {
      const createContentDto: CreateContentDto = {
        title: 'Test Movie',
        genre: ['Drama', 'Action'],
        year: 2023,
        actors: ['Actor One'],
        description: 'Test description',
        rating: 8.0,
        type: ContentType.MOVIE, // Asegúrate de que sea un tipo válido
        director: 'Test Director',
      };

      const expectedContent = {
        id: testUuid,
        ...createContentDto,
      };

      mockRepository.create.mockReturnValue(expectedContent);
      mockRepository.save.mockResolvedValue(expectedContent);

      const result = await service.create(createContentDto);
      expect(result).toEqual(expectedContent);
      expect(mockRepository.create).toHaveBeenCalledWith(createContentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedContent);
    });
  });

  describe('findAll', () => {
    it('should return an array of content', async () => {
      const expectedContent = [mockRepository.create({ id: testUuid })];

      mockRepository.find.mockResolvedValue(expectedContent);

      const result = await service.findAll();

      expect(result).toEqual(expectedContent);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single content', async () => {
      const expectedContent = { id: testUuid, title: 'Test Movie' };

      mockRepository.findOneBy.mockResolvedValue(expectedContent);

      const result = await service.findOne(testUuid);

      expect(result).toEqual(expectedContent);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: testUuid });
    });

    it('should throw a NotFoundException if content is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(testUuid)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(testUuid)).rejects.toThrow(`Content with ID ${testUuid} not found`);
    });
  });

  describe('update', () => {
    it('should update and return the content', async () => {
      const updateContentDto = {
        title: 'Updated Movie',
        genre: ['Drama'],
        year: 2024,
        actors: ['Actor Updated'],
        description: 'Updated description',
        rating: 9.0,
        type: ContentType.MOVIE,
        director: 'Updated Director',
      };

      const existingContent = { id: testUuid, ...updateContentDto };
      mockRepository.preload.mockResolvedValue(existingContent);
      mockRepository.save.mockResolvedValue(existingContent);

      const result = await service.update(testUuid, updateContentDto);

      expect(result).toEqual(existingContent);
      expect(mockRepository.preload).toHaveBeenCalledWith({ id: testUuid, ...updateContentDto });
      expect(mockRepository.save).toHaveBeenCalledWith(existingContent);
    });

    it('should throw a NotFoundException if content is not found for update', async () => {
      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update(testUuid, {})).rejects.toThrow(NotFoundException);
      await expect(service.update(testUuid, {})).rejects.toThrow(`Content with ID ${testUuid} not found`);
    });
  });

  describe('remove', () => {
    it('should remove the content', async () => {
      const contentToRemove = { id: testUuid };
      mockRepository.findOneBy.mockResolvedValue(contentToRemove);
      mockRepository.remove.mockResolvedValue(contentToRemove);

      const result = await service.remove(testUuid);

      expect(result).toEqual(contentToRemove);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: testUuid });
      expect(mockRepository.remove).toHaveBeenCalledWith(contentToRemove);
    });
  });
});
