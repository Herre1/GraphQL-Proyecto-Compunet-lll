import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NotFoundException } from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let mockCommentsService: any;  

  beforeEach(async () => {
    mockCommentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),        
      replyToComment: jest.fn(),
      findReplies: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  describe('findOne', () => {
    it('should return a comment if found', async () => {
      const comment = { id: 'validId', content: 'Test comment' };
      mockCommentsService.findOne.mockResolvedValue(comment);  
      
      expect(await controller.findOne('validId')).toBe(comment);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentsService.findOne.mockRejectedValue(new NotFoundException());  

      await expect(controller.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated comment', async () => {
      const updatedComment = { id: 'validId', content: 'Updated content' };
      mockCommentsService.update.mockResolvedValue(updatedComment);  
      
      expect(await controller.update('validId', { content: 'Updated content' })).toBe(updatedComment);
    });

    it('should throw NotFoundException if comment not found for update', async () => {
      mockCommentsService.update.mockRejectedValue(new NotFoundException());  

      await expect(controller.update('invalidId', { content: 'Updated content' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should return removed comment', async () => {
      const deletedComment = { id: 'validId', content: 'Test comment' };
      mockCommentsService.remove.mockResolvedValue(deletedComment);  
      
      expect(await controller.remove('validId')).toBe(deletedComment);
    });

    it('should throw NotFoundException if comment not found for deletion', async () => {
      mockCommentsService.remove.mockRejectedValue(new NotFoundException());  
      
      await expect(controller.remove('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});
