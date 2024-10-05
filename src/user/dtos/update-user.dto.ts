import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @Length(3, 50) // Validación opcional del tamaño del nombre
  @IsOptional()
  fullName?: string;

  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  @IsOptional()
  email?: string;

  @IsString()
  @Length(6, 100) // Validación opcional de longitud de la contraseña
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString({ each: true }) // Cada elemento del array debe ser una cadena
  @IsOptional()
  roles?: string[];
}
