import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { User } from '../Auth/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { ReactionType } from './enums/reaction-type.enum';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const { userId, commentId, type } = createReactionDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const existingReaction = await this.reactionRepository.findOne({
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    if (existingReaction) {
      throw new BadRequestException('User has already reacted to this comment');
    }

    const reaction = this.reactionRepository.create({
      user,
      comment,
      type,
    });

    return this.reactionRepository.save(reaction);
  }

  async findAll(): Promise<Reaction[]> {
    return this.reactionRepository.find({ relations: ['user', 'comment'] });
  }

  async findByComment(commentId: string): Promise<Reaction[]> {
    const reactions = await this.reactionRepository.find({
      where: { comment: { id: commentId } },
      relations: ['user', 'comment'],
    });
    if (!reactions.length) {
      throw new NotFoundException(`No reactions found for comment with ID ${commentId}`);
    }
    return reactions;
  }

  async findByUser(userId: string): Promise<Reaction[]> {
    const reactions = await this.reactionRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'comment'],
    });
    if (!reactions.length) {
      throw new NotFoundException(`No reactions found for user with ID ${userId}`);
    }
    return reactions;
  }

  async remove(id: string): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
    return this.reactionRepository.remove(reaction);
  }

  // Nuevo método para contar las reacciones (likes y dislikes) de un comentario específico
  async countReactionsByComment(commentId: string) {
    const likeCount = await this.reactionRepository.count({
      where: { comment: { id: commentId }, type: ReactionType.LIKE },
    });

    const dislikeCount = await this.reactionRepository.count({
      where: { comment: { id: commentId }, type: ReactionType.DISLIKE },
    });

    return { likes: likeCount, dislikes: dislikeCount };
  }
}