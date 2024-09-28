import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  // Crear una nueva reacción
  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const newReaction = new this.reactionModel(createReactionDto);
    return newReaction.save();
  }

  // Obtener todas las reacciones
  async findAll(): Promise<Reaction[]> {
    return this.reactionModel.find().exec();
  }

  // Obtener reacciones por ID del comentario
  async findByComment(commentId: string): Promise<Reaction[]> {
    const reactions = await this.reactionModel.find({ comment: commentId }).exec();
    if (!reactions.length) {
      throw new NotFoundException(`No reactions found for comment with ID ${commentId}`);
    }
    return reactions;
  }

  // Obtener todas las reacciones de un usuario
  async findByUser(userId: string): Promise<Reaction[]> {
    const reactions = await this.reactionModel.find({ user: userId }).exec();
    if (!reactions.length) {
      throw new NotFoundException(`No reactions found for user with ID ${userId}`);
    }
    return reactions;
  }

  // Eliminar una reacción
  async remove(id: string): Promise<Reaction> {
    const deletedReaction = await this.reactionModel.findByIdAndDelete(id).exec();
    if (!deletedReaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
    return deletedReaction;
  }
}