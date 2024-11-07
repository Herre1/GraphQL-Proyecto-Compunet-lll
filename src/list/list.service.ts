import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entity/list.entity';
import { User } from '../Auth/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { CreateListDto } from '../list/dtos/create-list.dto';
import { AddContentToListDto } from './dtos/add-content-to-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Content) private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createListDto: CreateListDto) {
    const { userId, contentIds, status } = createListDto;

    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Obtener el contenido relacionado
    const contents = await this.contentRepository.findByIds(contentIds);
    if (!contents.length) {
      throw new NotFoundException('Content not found');
    }

    // Crear la nueva lista
    const newList = this.listRepository.create({ user, contents, status });
    return this.listRepository.save(newList);
  }

  async findByUser(userId: string) {
    return this.listRepository.find({
      where: { user: { id: userId } },
      relations: ['contents'], // Incluye la relación con contenidos
    });
  }
  

  async remove(listId: string, userId: string): Promise<void> {
    // Buscar la lista por su ID y el usuario
    const list = await this.listRepository.findOne({
      where: { id: listId, user: { id: userId } },
      relations: ['contents'],
    });

    // Verificar si la lista existe
    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found for user ${userId}`);
    }

    // Eliminar la lista
    await this.listRepository.remove(list);
  }

  async addContentToList(addContentToListDto: AddContentToListDto) {
    const { userId, contentIds } = addContentToListDto;
    // Obtener el ID de la primera lista del usuario
    const listIds = await this.findListIdsByUser(userId);
    if (listIds.length === 0) {
      throw new NotFoundException(`No lists found for user with ID ${userId}`);
    }
    const listId = listIds[0]; // Escoge el primer ID de lista

    // Verificar si la lista existe
    const list = await this.listRepository.findOne({
      where: { id: listId, user: { id: userId } },
      relations: ['contents'],
    });
    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found for user ${userId}`);
    }

    // Obtener y añadir el contenido sin duplicados
    const contents = await this.contentRepository.findByIds(contentIds);
    if (!contents.length) {
      throw new NotFoundException('No valid contents found for the provided IDs');
    }

    list.contents = [...list.contents, ...contents.filter(
      (content) => !list.contents.some(existing => existing.id === content.id)
    )];

    return this.listRepository.save(list);
  }

  async findListIdsByUser(userId: string): Promise<string[]> {
    // Obtener las listas asociadas al usuario y solo extraer los IDs
    const lists = await this.listRepository.find({
      where: { user: { id: userId } },
      select: ['id'], // Solo selecciona el ID de las listas
    });

    // Retornar un array de IDs de las listas
    return lists.map(list => list.id);
  }
}
