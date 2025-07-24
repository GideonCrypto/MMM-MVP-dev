import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class createPortfolioDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsDateString()
    createdAt!: string;

    @ApiProperty()
    @IsInt()
    userId!: number;
}

export class addPortfolioTagDto {
    @ApiProperty()
    @IsOptional()
    @IsInt()
    id!: number | null;

    @ApiProperty()
    @IsInt()
    transactionId!: number;

    @ApiProperty()
    @IsInt()
    userId!: number;
}

export class getPortfoliosDto {
    @ApiProperty()
    @IsInt()
    id!: number;

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsDateString()
    createdAt!: string;

    @ApiProperty()
    @IsInt()
    userId!: number;
}