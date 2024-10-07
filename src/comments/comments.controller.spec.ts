import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotFoundException } from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    replyToComment: jest.fn(),
    findReplies: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        userId: 'userId',
        contentId: 'contentId'
      };
      const result = { id: 'commentId', content: 'Test comment' };

      mockCommentsService.create.mockResolvedValue(result);
      const response = await controller.create(createCommentDto.contentId, createCommentDto.userId, createCommentDto);

      expect(response).toEqual(result);
      expect(mockCommentsService.create).toHaveBeenCalledWith(createCommentDto, createCommentDto.userId, createCommentDto.contentId);
    });
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const result = [{ id: 'commentId', content: 'Test comment' }];
      mockCommentsService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();
      expect(response).toEqual(result);
      expect(mockCommentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single comment', async () => {
      const result = { id: 'commentId', content: 'Test comment' };
      mockCommentsService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('commentId');
      expect(response).toEqual(result);
      expect(mockCommentsService.findOne).toHaveBeenCalledWith('commentId');
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentsService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('replyToComment', () => {
    it('should reply to a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Reply content',
        userId: 'userId',
        contentId: 'contentId',
        parentComment: 'parentId'
      };
      const result = { id: 'replyId', content: 'Reply content' };

      mockCommentsService.replyToComment.mockResolvedValue(result);
      const response = await controller.replyToComment(createCommentDto.parentComment, createCommentDto.userId, createCommentDto.contentId, createCommentDto);

      expect(response).toEqual(result);
      expect(mockCommentsService.replyToComment).toHaveBeenCalledWith(createCommentDto.parentComment, createCommentDto, createCommentDto.userId, createCommentDto.contentId);
    });
  });

  describe('findReplies', () => {
    it('should return replies of a comment', async () => {
      const result = [{ id: 'replyId', content: 'Reply content' }];
      mockCommentsService.findReplies.mockResolvedValue(result);

      const response = await controller.findReplies('parentId');
      expect(response).toEqual(result);
      expect(mockCommentsService.findReplies).toHaveBeenCalledWith('parentId');
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated content' };
      const commentId = 'commentId';
      const result = { id: commentId, content: 'Updated content' };

      mockCommentsService.update.mockResolvedValue(result);
      const response = await controller.update(commentId, updateCommentDto);

      expect(response).toEqual(result);
      expect(mockCommentsService.update).toHaveBeenCalledWith(commentId, updateCommentDto);
    });

    it('should throw NotFoundException if comment not found for update', async () => {
      mockCommentsService.update.mockResolvedValue(null);
      await expect(controller.update('invalidId', { content: 'Updated content' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const commentId = 'commentId';
      const result = { id: commentId, content: 'Deleted comment' };

      mockCommentsService.remove.mockResolvedValue(result);
      const response = await controller.remove(commentId);

      expect(response).toEqual(result);
      expect(mockCommentsService.remove).toHaveBeenCalledWith(commentId);
    });

    it('should throw NotFoundException if comment not found for deletion', async () => {
      mockCommentsService.remove.mockResolvedValue(null);
      await expect(controller.remove('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});
