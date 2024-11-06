// src/content/content.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: Repository<Content>,
    private readonly cloudinaryProvider: CloudinaryProvider
  ) {}

    async create(createContentDto: CreateContentDto, file: Express.Multer.File) {
        const uploadResult = await this.cloudinaryProvider.uploadImage(file);
        const content = this.contentRepository.create({
          ...createContentDto,
          imageUrl: uploadResult.secure_url,
        });
        return this.contentRepository.save(content);
      }

    async update(id: string, updateContentDto: UpdateContentDto, file?: Express.Multer.File) {
      const content = await this.findOne(id);

      if (file) {
        const uploadResult = await this.cloudinaryProvider.uploadImage(file);
        content.imageUrl = uploadResult.secure_url;
      }

    Object.assign(content, updateContentDto);
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


  async remove(id: string) {

    const content = await this.findOne(id);

    return this.contentRepository.remove(content);

  }
  
}