import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  commentId: string; // Relación con el comentario

  @IsString()
  @IsNotEmpty()
  userId: string; // Relación con el usuario

  @IsEnum(['like', 'dislike'])
  type: string; // Tipo de reacción (like, dislike, etc.)
}