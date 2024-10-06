import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Content } from '../../content/entities/content.entity'; // Relación con la entidad Content
import { User } from '../../auth/entities/user.entity'; // Relación con la entidad User

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

  @Column('simple-array', { default: [] })
  reactions: string[];

  @Column('int', { default: 0 })
  reactionsCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}