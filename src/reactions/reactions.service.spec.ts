import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReactionsService } from '../reactions/reactions.service';
import { Reaction } from '../reactions/entities/reaction.entity';
import { User } from '../auth/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { ReactionType } from './enums/reaction-type.enum';

describe('ReactionsService', () => {
  let service: ReactionsService;
  let reactionRepository: Repository<Reaction>;
  let userRepository: Repository<User>;
  let commentRepository: Repository<Comment>;

  const mockReactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockCommentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsService,
        {
          provide: getRepositoryToken(Reaction),
          useValue: mockReactionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
    reactionRepository = module.get<Repository<Reaction>>(getRepositoryToken(Reaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  describe('create', () => {
    it('should create a reaction', async () => {
    const createReactionDto: CreateReactionDto = { userId: 'userId', commentId: 'commentId', type: ReactionType.LIKE };
      const mockUser = new User();
      const mockComment = new Comment();
      const mockReaction = new Reaction();

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockReactionRepository.create.mockReturnValue(mockReaction);
      mockReactionRepository.save.mockResolvedValue(mockReaction);

      const result = await service.create(createReactionDto);

      expect(result).toEqual(mockReaction);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: createReactionDto.userId } });
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({ where: { id: createReactionDto.commentId } });
      expect(mockReactionRepository.create).toHaveBeenCalledWith({ user: mockUser, comment: mockComment, type: createReactionDto.type });
    });

    it('should throw NotFoundException if user not found', async () => {
      const createReactionDto: CreateReactionDto = { userId: 'userId', commentId: 'commentId', type: ReactionType.LIKE };
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(service.create(createReactionDto)).rejects.toThrow(
        new NotFoundException(`User with ID ${createReactionDto.userId} not found`),
      );
    });

    it('should throw NotFoundException if comment not found', async () => {
      const createReactionDto: CreateReactionDto = { userId: 'userId', commentId: 'commentId', type: ReactionType.LIKE };
      const mockUser = new User();
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCommentRepository.findOne.mockResolvedValue(null);
      
      await expect(service.create(createReactionDto)).rejects.toThrow(
        new NotFoundException(`Comment with ID ${createReactionDto.commentId} not found`),
      );
    });

    it('should throw BadRequestException if reaction already exists', async () => {
      const createReactionDto: CreateReactionDto = { userId: 'userId', commentId: 'commentId', type: ReactionType.LIKE };
      const mockUser = new User();
      const mockComment = new Comment();
      const existingReaction = new Reaction();

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockReactionRepository.findOne.mockResolvedValue(existingReaction);
      
      await expect(service.create(createReactionDto)).rejects.toThrow(
        new BadRequestException('User has already reacted to this comment'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all reactions', async () => {
      const mockReactions = [new Reaction(), new Reaction()];
      mockReactionRepository.find.mockResolvedValue(mockReactions);

      const result = await service.findAll();

      expect(result).toEqual(mockReactions);
      expect(mockReactionRepository.find).toHaveBeenCalledWith({ relations: ['user', 'comment'] });
    });
  });

  describe('findByComment', () => {
    it('should return reactions for a comment', async () => {
      const commentId = 'commentId';
      const mockReactions = [new Reaction(), new Reaction()];
      mockReactionRepository.find.mockResolvedValue(mockReactions);

      const result = await service.findByComment(commentId);

      expect(result).toEqual(mockReactions);
      expect(mockReactionRepository.find).toHaveBeenCalledWith({ where: { comment: { id: commentId } }, relations: ['user', 'comment'] });
    });

    it('should throw NotFoundException if no reactions found', async () => {
      const commentId = 'invalidCommentId';
      mockReactionRepository.find.mockResolvedValue([]);

      await expect(service.findByComment(commentId)).rejects.toThrow(
        new NotFoundException(`No reactions found for comment with ID ${commentId}`),
      );
    });
  });

  describe('findByUser', () => {
    it('should return reactions for a user', async () => {
      const userId = 'userId';
      const mockReactions = [new Reaction(), new Reaction()];
      mockReactionRepository.find.mockResolvedValue(mockReactions);

      const result = await service.findByUser(userId);

      expect(result).toEqual(mockReactions);
      expect(mockReactionRepository.find).toHaveBeenCalledWith({ where: { user: { id: userId } }, relations: ['user', 'comment'] });
    });

    it('should throw NotFoundException if no reactions found', async () => {
      const userId = 'invalidUserId';
      mockReactionRepository.find.mockResolvedValue([]);

      await expect(service.findByUser(userId)).rejects.toThrow(
        new NotFoundException(`No reactions found for user with ID ${userId}`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a reaction', async () => {
      const reactionId = 'reactionId';
      const mockReaction = new Reaction();

      mockReactionRepository.findOne.mockResolvedValue(mockReaction);
      mockReactionRepository.remove.mockResolvedValue(mockReaction);

      const result = await service.remove(reactionId);
      expect(result).toEqual(mockReaction);
      expect(mockReactionRepository.findOne).toHaveBeenCalledWith({ where: { id: reactionId } });
    });

    it('should throw NotFoundException if reaction not found', async () => {
      const reactionId = 'invalidId';
      mockReactionRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(reactionId)).rejects.toThrow(
        new NotFoundException(`Reaction with ID ${reactionId} not found`),
      );
    });
  });
});
