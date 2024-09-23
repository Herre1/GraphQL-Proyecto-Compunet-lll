import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCarDto {
  @IsString()
  readonly brand: string;

  @IsString()
  readonly model: string;

  @IsInt({ message: 'año debe ser un entero' })
  @Min(1990)
  @Max(2100)
  readonly year: number;
}
