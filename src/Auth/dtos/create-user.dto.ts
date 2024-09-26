import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    fullName: string;

    @IsString()
    @IsEmail()
    email: string;

    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}/, {
        message: "Password too weak"
    })
    password: string;
}