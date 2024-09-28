import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  // Crear un nuevo comentario
  async create(createCommentDto: CreateCommentDto, userId: string, contentId: string): Promise<Comment> {
    const newComment = new this.commentModel({
      ...createCommentDto,
      author: userId,       // Relacionar el comentario con el usuario
      contentId: contentId, // Relacionar el comentario con el contenido
    });
    return newComment.save();
  }

  // Obtener todos los comentarios
  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  // Obtener un comentario por su ID
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  // Responder a un comentario 
  async replyToComment(parentCommentId: string, createCommentDto: CreateCommentDto, userId: string, contentId: string): Promise<Comment> {
    const parentComment = await this.commentModel.findById(parentCommentId).exec();
    if (!parentComment) {
      throw new NotFoundException(`Parent comment with ID ${parentCommentId} not found`);
    }

    const reply = new this.commentModel({
      ...createCommentDto,
      parentComment: parentCommentId, // Relacionamos la respuesta con el comentario padre
      author: userId,                 // Relacionar el comentario con el usuario
      contentId: contentId,           // Relacionar el comentario con el contenido
    });
    const savedReply = await reply.save();

    // Añadir la respuesta a la lista de respuestas del comentario padre
    parentComment.replies.push(savedReply._id.toString());  
    await parentComment.save();

    return savedReply;
  }

  // Obtener todas las respuestas de un comentario
  async findReplies(parentCommentId: string): Promise<Comment[]> {
    const replies = await this.commentModel.find({ parentComment: parentCommentId }).exec();
    if (!replies.length) {
      throw new NotFoundException(`No replies found for comment with ID ${parentCommentId}`);
    }
    return replies;
  }

  // Actualizar un comentario
  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true }).exec();
    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return updatedComment;
  }

  // Eliminar un comentario
  async remove(id: string): Promise<Comment> {
    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    //eliminar respuestas asociadas
    await this.commentModel.deleteMany({ parentComment: id }).exec();

    return deletedComment;
  }
}