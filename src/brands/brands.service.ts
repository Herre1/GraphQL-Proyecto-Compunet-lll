import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) {}

  create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandRepository.create(createBrandDto);
      return this.brandRepository.save(brand);
    }catch(error) {

      console.log(error);
      throw new InternalServerErrorException("Can't create brand");
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit=10, offset=0 } = paginationDto;

    return this.brandRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let brand: Brand;

    if (isUUID(term)) {
      brand = await this.brandRepository.findOneBy({ id: term });
    }else {
      const queryBuilder = this.brandRepository.createQueryBuilder();
      brand = await queryBuilder.where('UPPER(name) =:brand or slug=:slug', 
                                { 
                                  brand: term.toUpperCase(), slug: term.toLowerCase() 
                                }).getOne();
    }

    if(!( brand instanceof Brand) ) {
      throw new NotFoundException(`Brand with term ${term} not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand =  await this.brandRepository.preload({
      id: id,
      ...updateBrandDto
    });
    return this.brandRepository.save(brand);
  }

  async  remove(id: string) {
    const brand = await this.findOne(id);

    await this.brandRepository.remove(brand);

  }
}
