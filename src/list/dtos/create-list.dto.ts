import { IsUUID, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsUUID('4')
  userId: string;  // ID del usuario al que estará ligada la lista

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // IDs del contenido que se quiere agregar a la lista
  contentIds: string[];
}
