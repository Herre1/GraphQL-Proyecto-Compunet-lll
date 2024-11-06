// src/content/content.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Auth } from '../Auth/decorators/auth.decorator';
import { ValidRoles } from '../Auth/interfaces/valid-roles';

@Controller('api/v1/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createContentDto: CreateContentDto, @UploadedFile() file: Express.Multer.File) {
    return this.contentService.create(createContentDto, file);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @UploadedFile() file?: Express.Multer.File) {
    return this.contentService.update(id, updateContentDto, file);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
