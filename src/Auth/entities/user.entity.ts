import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { List } from '../../list/entity/list.entity';
import { Reaction } from '../../reactions/entities/reaction.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class User {

    @Field(() => String) // Campo de tipo ID en GraphQL
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field() // Texto en GraphQL
    @Column('text')
    fullName: string;

    @Field() // Texto en GraphQL
    @Column('text', { unique: true })
    email: string;

    // Omite @Field para password si no deseas exponerlo en GraphQL
    @Column('text', { select: false })
    password: string;

    @Field(() => Boolean) // Booleano en GraphQL
    @Column('boolean', { default: true })
    isActive: boolean;

    @Field(() => [String]) // Array de strings en GraphQL
    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @BeforeInsert()
    checkEmail(): void {
        this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()
    checkEmailUpdate(): void {
        this.checkEmail();
    }

    @Field(() => [Comment], { nullable: true }) // Relación con comentarios
    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @Field(() => [Reaction], { nullable: true }) // Relación con reacciones
    @OneToMany(() => Reaction, (reaction) => reaction.user)
    reactions: Reaction[];

    @Field(() => [List], { nullable: true }) // Relación con listas
    @OneToMany(() => List, (list) => list.user)
    lists: List[];
}
