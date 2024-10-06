import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  // Crear una nueva reacción
  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const reaction = this.reactionRepository.create(createReactionDto);
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