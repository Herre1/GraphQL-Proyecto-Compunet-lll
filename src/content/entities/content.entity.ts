import { Column, Entity, OneToMany, PrimaryGeneratedColumn , ManyToOne } from "typeorm";
import { ContentType } from '../enums/content-type.enum'; // Importamos el enum que definimos
import { Comment } from '../../comments/entities/comment.entity';
import { List } from '../../list/entity/list.entity';

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
    rating: number; // Considerar validaciones adicionales en el DTO para asegurarse de que esté entre 0 y 10

    @Column({
        type: 'enum',
        enum: ContentType,
    })
    type: ContentType; // Usamos un enumerador en lugar de texto libre

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

    @OneToMany(() => Comment, (comment) => comment.contentId)
    comments: Comment[];

    @ManyToOne(() => List, (list) => list.contents)
    list: List;

}