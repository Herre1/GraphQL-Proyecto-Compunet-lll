import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

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

  // Crear una nueva reacción
  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const { userId, commentId, type } = createReactionDto;

    // Buscar el usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Buscar el comentario
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Verificar si ya existe una reacción de este usuario para este comentario
    const existingReaction = await this.reactionRepository.findOne({
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    if (existingReaction) {
      throw new BadRequestException('User has already reacted to this comment');
    }

    // Crear la reacción si no existe una previa
    const reaction = this.reactionRepository.create({
      user,       // Asignar la entidad User
      comment,    // Asignar la entidad Comment
      type,       // Tipo de reacción
    });

    return this.reactionRepository.save(reaction);
  }

  // Obtener todas las reacciones
  async findAll(): Promise<Reaction[]> {
    return this.reactionRepository.find({ relations: ['user', 'comment'] });
  }

  // Obtener reacciones por ID del comentario
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

  // Obtener todas las reacciones de un usuario
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

  // Eliminar una reacción
  async remove(id: string): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
    return this.reactionRepository.remove(reaction);
  }
  
}