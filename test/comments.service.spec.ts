import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { CommentsService } from 'src/comments/comments.service';
import { Content } from 'src/content/entities/content.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepository: Repository<Comment>;
  let userRepository: Repository<User>;
  let contentRepository: Repository<Content>;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockContentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Content),
          useValue: mockContentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    contentRepository = module.get<Repository<Content>>(getRepositoryToken(Content));
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto = { content: 'Test comment', userId: 'userId', contentId: 'contentId' };
      const userId = 'userId';
      const contentId = 'contentId';
      const mockUser = new User();
      const mockContent = new Content();

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockCommentRepository.create.mockReturnValue(mockCommentRepository);
      mockCommentRepository.save.mockResolvedValue(mockCommentRepository);

      const result = await service.create(createCommentDto, userId, contentId);

      expect(result).toEqual(mockCommentRepository);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockContentRepository.findOne).toHaveBeenCalledWith({ where: { id: contentId } });
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        author: mockUser,
        contentId: mockContent,
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockCommentRepository);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createCommentDto = { content: 'Test comment', userId: 'invalidUserId', contentId: 'contentId' };
      const userId = 'invalidUserId';
      const contentId = 'contentId';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCommentDto, userId, contentId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });

    it('should throw NotFoundException if content not found', async () => {
      const createCommentDto = { content: 'Test comment', userId: 'userId', contentId: 'invalidContentId' };
      const userId = 'userId';
      const contentId = 'invalidContentId';
      const mockUser = new User();

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCommentDto, userId, contentId)).rejects.toThrow(
        new NotFoundException(`Content with ID ${contentId} not found`),
      );
    });
  });

  describe('findAll', () => {
    it('should return all comments', async () => {
      const mockComments = [new Comment(), new Comment()];
      mockCommentRepository.find.mockResolvedValue(mockComments);

      const result = await service.findAll();
      expect(result).toEqual(mockComments);
      expect(mockCommentRepository.find).toHaveBeenCalledWith({ relations: ['author', 'contentId', 'replies'] });
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const mockComment = new Comment();
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.findOne('someId');
      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({ where: { id: 'someId' }, relations: ['author', 'contentId', 'replies'] });
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalidId')).rejects.toThrow(new NotFoundException(`Comment with ID invalidId not found`));
    });
  });

  describe('replyToComment', () => {
    it('should reply to a comment', async () => {
      const parentCommentId = 'parentId';
      const createCommentDto = { content: 'Reply content', userId: 'userId', contentId: 'contentId' };
      const mockUser = new User();
      const mockContent = new Content();
      const parentComment = new Comment();
      const savedReply = new Comment();

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockCommentRepository.findOne.mockResolvedValue(parentComment);
      mockCommentRepository.create.mockReturnValue(savedReply);
      mockCommentRepository.save.mockResolvedValue(savedReply);
      
      const result = await service.replyToComment(parentCommentId, createCommentDto, 'userId', 'contentId');
      expect(result).toEqual(savedReply);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({ where: { id: parentCommentId } });
    });

    it('should throw NotFoundException if parent comment not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);
      await expect(service.replyToComment('invalidId', {
          content: 'Reply',
          userId: '',
          contentId: ''
      }, 'userId', 'contentId')).rejects.toThrow(
        new NotFoundException(`Parent comment with ID invalidId not found`)
      );
    });
  });


  describe('remove', () => {
    it('should remove a comment', async () => {
      const commentId = 'commentId';
      const mockComment = new Comment();

      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(commentId);
      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({ where: { id: commentId } });
    });

    it('should throw NotFoundException if comment not found for deletion', async () => {
      const commentId = 'invalidId';
      mockCommentRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(commentId)).rejects.toThrow(
        new NotFoundException(`Comment with ID ${commentId} not found`)
      );
    });
  });
});
