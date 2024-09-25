import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // ID del usuario
  @IsString()
  @IsNotEmpty()
  author: string;  

  @IsString()
  parentComment?: string;  
}
