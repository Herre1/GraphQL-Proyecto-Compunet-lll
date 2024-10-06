import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { ReactionType } from '../enums/reaction-type.enum'; // Importamos el enum

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ReactionType)
  type: ReactionType;

}