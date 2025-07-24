import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, MinLength } from 'class-validator';

export class AuthUserDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password!: string;
}

export class GetUserDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    access_token!: string;

    @ApiProperty()
    @IsNumber()
    id!: string;

    @ApiProperty()
    @IsDate()
    createdAt!: Date; 
}