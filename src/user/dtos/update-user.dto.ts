import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

@InputType() // Decorador para habilitar uso en GraphQL
export class UpdateUserDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  fullName?: string;

  @Field({ nullable: true })
  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(6, 100)
  @IsOptional()
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  roles?: string[];
}
