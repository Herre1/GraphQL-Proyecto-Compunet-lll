import { IsString, IsInt, IsArray, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ContentType } from '../enums/content-type.enum'; // Importamos el enum

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

  @IsEnum(ContentType)
  type: ContentType; // Usamos el enumerador para validar los tipos

  @IsString()
  director: string;

  @IsOptional()
  @IsInt()
  seasons?: number; // Opcional para series

  @IsOptional()
  @IsInt()
  episodes?: number; // Opcional para series o animes

  @IsOptional()
  @IsString()
  studio?: string; // Solo para anime

  @IsOptional()
  @IsString()
  productionCompany?: string; // Para películas y series

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number; // Validar que el rating esté en el rango de 0 a 10
  
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
