import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

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

  @Post() // Solo admin puede crear contenido
  @Auth(ValidRoles.admin)
  create(@Body() createContentDto: CreateContentDto) {

    return this.contentService.create(createContentDto);

  }

  @Patch(':id')
  @Auth(ValidRoles.admin) // Solo admin puede actualizar contenido
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {

    return this.contentService.update(id, updateContentDto);

  }

  @Delete(':id')
  @Auth(ValidRoles.admin) // Solo admin puede eliminar contenido
  remove(@Param('id') id: string) {

    return this.contentService.remove(id);

  }
  
}