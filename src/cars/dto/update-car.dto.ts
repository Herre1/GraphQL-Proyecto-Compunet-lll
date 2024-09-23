import { IsString, IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';

export class UpdateCarDto {
  @IsUUID()
  @IsOptional()
  readonly id?: string;

  @IsString()
  @IsOptional()
  readonly brand?: string;

  @IsString()
  @IsOptional()
  readonly model?: string;

  @IsInt({ message: 'año debe ser un entero' })
  @IsOptional()
  @Min(1990)
  @Max(2100)
  readonly year?: number;
}
