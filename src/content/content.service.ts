import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {

  constructor(@InjectRepository(Content) private readonly contentRepository: Repository<Content>) {}

  create(createContentDto: CreateContentDto) {

    const content = this.contentRepository.create(createContentDto);

    return this.contentRepository.save(content);

  }

  findAll() {

    return this.contentRepository.find();

  }

  async findOne(id: string) {

    const content = await this.contentRepository.findOneBy({ id });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
    
  }

  async update(id: string, updateContentDto: UpdateContentDto) {

    const content = await this.contentRepository.preload({id,...updateContentDto,});

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return this.contentRepository.save(content);

  }

  async remove(id: string) {

    const content = await this.findOne(id);

    return this.contentRepository.remove(content);

  }
  
}