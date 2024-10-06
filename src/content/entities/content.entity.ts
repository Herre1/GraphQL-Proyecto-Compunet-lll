import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from '../../comments/entities/comment.entity';

@Entity('contents')
export class Content {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('simple-array')
    genre: string[]; // Lista de géneros, almacenados como un array simple

    @Column('int')
    year: number;

    @Column('simple-array')
    actors: string[]; // Lista de actores, almacenados como un array simple

    @Column('text')
    description: string;

    @Column('float', { default: 0 })
    rating: number;

    @Column('text')
    type: string; // Definir si es película, serie o anime

    @Column('text')
    director: string; // Director de la película, serie o anime

    @Column('int', { nullable: true })
    seasons?: number; // Número de temporadas (en caso de series)

    @Column('int', { nullable: true })
    episodes?: number; // Número de episodios (en caso de series o animes)

    @Column('text', { nullable: true })
    studio?: string; // Estudio de animación (para animes)
    
    @Column('text', { nullable: true })
    productionCompany?: string; // Compañía productora (para películas y series)

    @OneToMany(() => Comment, (comment) => comment.id)
    comments: Comment[];


}