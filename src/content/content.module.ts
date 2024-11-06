// src/content/content.module.ts
import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), ConfigModule],
  controllers: [ContentController],
  providers: [ContentService, CloudinaryProvider],
})
export class ContentModule {}
