import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto'; // Asegúrate de que la ruta sea correcta
import { ReactionType } from './enums/reaction-type.enum';

describe('ReactionsController', () => {
  let reactionsController: ReactionsController;
  let reactionsService: ReactionsService;

  const mockReactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByComment: jest.fn(),
    findByUser: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(), // Método de actualización agregado
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionsController],
      providers: [
        {
          provide: ReactionsService,
          useValue: mockReactionsService,
        },
      ],
    }).compile();

    reactionsController = module.get<ReactionsController>(ReactionsController);
    reactionsService = module.get<ReactionsService>(ReactionsService);
  });

  it('should be defined', () => {
    expect(reactionsController).toBeDefined();
  });

  it('should create a reaction', async () => {
    const createReactionDto: CreateReactionDto = { 
      userId: '1', 
      commentId: '1', 
      type: ReactionType.LIKE 
    };
    const result = { id: '1', ...createReactionDto };

    mockReactionsService.create.mockResolvedValue(result);

    expect(await reactionsController.create(createReactionDto)).toEqual(result);
    expect(mockReactionsService.create).toHaveBeenCalledWith(createReactionDto);
  });

  it('should find all reactions', async () => {
    const result = [
      { id: '1', userId: '1', commentId: '1', type: ReactionType.LIKE },
      { id: '2', userId: '2', commentId: '2', type: ReactionType.DISLIKE }
    ];

    mockReactionsService.findAll.mockResolvedValue(result);

    expect(await reactionsController.findAll()).toEqual(result);
    expect(mockReactionsService.findAll).toHaveBeenCalled();
  });

  it('should find reactions by comment id', async () => {
    const commentId = '1';
    const result = [{ id: '1', userId: '1', commentId: '1', type: ReactionType.LIKE }];
    
    mockReactionsService.findByComment.mockResolvedValue(result);

    expect(await reactionsController.findByComment(commentId)).toEqual(result);
    expect(mockReactionsService.findByComment).toHaveBeenCalledWith(commentId);
  });

  it('should find reactions by user id', async () => {
    const userId = '1';
    const result = [{ id: '1', userId: '1', commentId: '1', type: ReactionType.LIKE }];
    
    mockReactionsService.findByUser.mockResolvedValue(result);

    expect(await reactionsController.findByUser(userId)).toEqual(result);
    expect(mockReactionsService.findByUser).toHaveBeenCalledWith(userId);
  });

  it('should remove a reaction', async () => {
    const reactionId = '1';
    const result = { id: '1', userId: '1', commentId: '1', type: ReactionType.LIKE };
    
    mockReactionsService.remove.mockResolvedValue(result);

    expect(await reactionsController.remove(reactionId)).toEqual(result);
    expect(mockReactionsService.remove).toHaveBeenCalledWith(reactionId);
  });
});
