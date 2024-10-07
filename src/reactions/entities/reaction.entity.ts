import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../Auth/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ReactionType } from '../enums/reaction-type.enum'; // Importamos el enum

@Entity('reactions')
export class Reaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.reactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Comment, comment => comment.reactions)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({
    type: 'enum',
    enum: ReactionType, // Usamos el enum aquí
  })
  type: ReactionType; // Tipo de reacción ahora es un enum

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
}