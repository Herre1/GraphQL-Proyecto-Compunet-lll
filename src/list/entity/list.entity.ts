import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.lists)
  user: User;
  
  @OneToMany(() => Content, (content) => content.list)
  contents: Content[];

  @Column('text')
  status: string; 
}
