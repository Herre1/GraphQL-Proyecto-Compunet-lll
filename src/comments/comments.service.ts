import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Content } from '../content/entities/content.entity';
import { User } from '../Auth/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string, contentId: string, parentCommentId?: string): Promise<Comment> {
    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Verificar que el contenido exista
    const content = await this.contentRepository.findOne({ where: { id: contentId } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
  
    // Si es un comentario de respuesta, buscar el comentario padre
    let parentComment = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({ where: { id: parentCommentId } });
      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${parentCommentId} not found`);
      }
    }
  
    // Crear el comentario
    const newComment = this.commentRepository.create({
      ...createCommentDto,
      author: user,           // Relacionar el comentario con el usuario
      contentId: content,     // Relacionar el comentario con el contenido
      parentComment: parentComment || undefined,  // Relacionar con el comentario padre si existe
    });
  
    return this.commentRepository.save(newComment);
  }
  
  async findByUser(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({ 
      where: { author: { id: userId } },
      relations: ['author', 'contentId', 'replies'],
      order: { createdAt: 'DESC' } 
    });
  }


  // Obtener todos los comentarios
  findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['author', 'contentId', 'replies'] });
  }

  // Obtener un comentario por su ID
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'contentId', 'replies'] });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  // Responder a un comentario
  async replyToComment(parentCommentId: string, createCommentDto: CreateCommentDto, userId: string, contentId: string): Promise<Comment> {
    // Verificar que el comentario padre exista
    const parentComment = await this.commentRepository.findOne({ where: { id: parentCommentId } });
    if (!parentComment) {
      throw new NotFoundException(`Parent comment with ID ${parentCommentId} not found`);
    }

    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verificar que el contenido exista
    const content = await this.contentRepository.findOne({ where: { id: contentId } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    // Crear la respuesta
    const reply = this.commentRepository.create({
      ...createCommentDto,
      parentComment, // Relacionamos la respuesta con el comentario padre
      author: user,  // Relacionar el comentario con el usuario
      contentId: content, // Relacionar el comentario con el contenido
    });

    const savedReply = await this.commentRepository.save(reply);

    // Añadir la respuesta a la lista de respuestas del comentario padre
    parentComment.replies = [...(parentComment.replies || []), savedReply];
    await this.commentRepository.save(parentComment);

    return savedReply;
  }

  // Obtener todas las respuestas de un comentario
  async findReplies(parentCommentId: string): Promise<Comment[]> {
    const parentComment = await this.findOne(parentCommentId);
    if (!parentComment.replies.length) {
      throw new NotFoundException(`No replies found for comment with ID ${parentCommentId}`);
    }
    return parentComment.replies;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    // Obtener el comentario que se va a actualizar
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  
    // Verificar si se actualizó el autor (usuario)
    let author = comment.author;
    if (updateCommentDto.userId) {
      author = await this.userRepository.findOne({ where: { id: updateCommentDto.userId } });
      if (!author) {
        throw new NotFoundException(`User with ID ${updateCommentDto.userId} not found`);
      }
    }
  
    // Verificar si se actualizó el contenido
    let content = comment.contentId;
    if (updateCommentDto.contentId) {
      content = await this.contentRepository.findOne({ where: { id: updateCommentDto.contentId } });
      if (!content) {
        throw new NotFoundException(`Content with ID ${updateCommentDto.contentId} not found`);
      }
    }
  
    // Verificar si se actualizó el comentario padre (para respuestas)
    let parentComment = comment.parentComment;
    if (updateCommentDto.parentComment) {
      parentComment = await this.commentRepository.findOne({ where: { id: updateCommentDto.parentComment } });
      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${updateCommentDto.parentComment} not found`);
      }
    }
  
    // Actualizar el comentario
    const updatedComment = await this.commentRepository.preload({
      id, // El ID es necesario para la carga previa de TypeORM
      content: updateCommentDto.content || comment.content,
      author,       // Relacionar con la entidad `User` actualizada (si es el caso)
      contentId: content,   // Relacionar con la entidad `Content` actualizada (si es el caso)
      parentComment, // Relacionar con la entidad `Comment` actualizada (si es el caso)
    });
  
    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${id} could not be updated`);
    }
  
    return this.commentRepository.save(updatedComment);
  }
  

  async remove(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
  
    // Eliminar respuestas asociadas al comentario
    await this.commentRepository.delete({ parentComment: { id } });
  
    // Eliminar el comentario original
    return this.commentRepository.remove(comment);
  }

    // Método para obtener los comentarios por el ID del contenido
    async findCommentsByContent(contentId: string): Promise<Comment[]> {
      // Verificamos si el contenido existe
      const content = await this.contentRepository.findOne({
        where: { id: contentId },
        relations: ['comments'], // Asegúrate de que cargue los comentarios relacionados
      });
  
      if (!content) {
        throw new NotFoundException(`Content with ID ${contentId} not found`);
      }
  
      // Devolver los comentarios asociados al contenido
      return content.comments;
    }
  
}