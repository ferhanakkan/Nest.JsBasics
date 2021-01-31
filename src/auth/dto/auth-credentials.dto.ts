import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
     {message: 'Sifre cok basit'}) // Sifre zorlugu icin kullaniyoruz. 1 buyuk harf 1 kucuk harf ve numara veya ozel karakter var mi diye bakar
    password: string;
}