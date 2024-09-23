import { IsOptional, IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  readonly slug?: string;
}
