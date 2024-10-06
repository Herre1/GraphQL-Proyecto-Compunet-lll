import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Content } from '../../content/entities/content.entity'; // Relación con la entidad Content
import { User } from '../../auth/entities/user.entity'; // Relación con la entidad User
import { Reaction } from '../../reactions/entities/reaction.entity'; // Relación con la entidad Reaction

@Entity('comments')
export class Comment {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  // Relación con el usuario (author)
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  author: User;

  // Relación con el contenido
  @ManyToOne(() => Content, (content) => content.comments, { onDelete: 'CASCADE' })
  contentId: Content;

  // Relación con comentario padre (en caso de ser una respuesta)
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parentComment?: Comment;

  // Relación con respuestas
  @OneToMany(() => Comment, (comment) => comment.parentComment, { cascade: true })
  replies: Comment[];

  // Relación con reacciones
  @OneToMany(() => Reaction, (reaction) => reaction.comment, { cascade: true })
  reactions: Reaction[]; // Las reacciones ahora están relacionadas con la entidad Reaction

  @Column('int', { default: 0 })
  reactionsCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  
}