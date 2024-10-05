import { IsString, IsInt, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsInt()
  year: number;

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @IsString()
  description: string;

  @IsEnum(['movie', 'series', 'anime'])
  type: string;

  @IsString()
  director: string;
}