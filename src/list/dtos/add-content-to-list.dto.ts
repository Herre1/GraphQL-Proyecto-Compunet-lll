import { IsUUID, IsString, IsArray, ArrayNotEmpty, IsIn } from 'class-validator';

export class AddContentToListDto {
  @IsUUID()
  userId: string;  // ID del usuario al que estará ligada la lista

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // IDs del contenido que se quiere agregar a la lista
  contentIds: string[];
  }
  