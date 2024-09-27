import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // ID del usuario
  @IsString()
  @IsNotEmpty()
  userId: string;  

  // ID del contenido (película, serie o anime)
  @IsString()
  @IsNotEmpty()
  contentId: string; 

  // ID del comentario padre (opcional)
  @IsString()
  @IsOptional() 
  parentComment?: string;
}
