import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entity/list.entity';
import { User } from '../auth/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { CreateListDto } from '../list/dtos/create-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Content) private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createListDto: CreateListDto) {
    const { userId, contentIds } = createListDto;

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
    const newList = this.listRepository.create({ user, contents });
    return this.listRepository.save(newList);
  }

  async findByUser(userId: string) {
    return this.listRepository.find({ where: { user: { id: userId } } });
  }
}