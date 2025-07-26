import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNumber, IsString } from 'class-validator';

export class AddTransactionDto {
    @ApiProperty()
    @IsString()
    type!: string;

    @ApiProperty()
    @IsString()
    assetId!: string;

    @ApiProperty()
    @IsNumber()
    quantity!: number;

    @ApiProperty()
    @IsNumber()
    price!: number;

    @ApiProperty()
    @IsDateString()
    timestamp!: string;

    @ApiProperty()
    @IsInt()
    userId!: number;

    @ApiProperty()
    @IsInt()
    portfolioId!: number;
}

export class UpdateTransactionDto extends AddTransactionDto {
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    id!: number;
}

export class GetTransactionsDto {
    @ApiProperty()
    @IsString()
    assetId!: string;

    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    userId!: number;
}

export class TransactionResponseDto {
    @ApiProperty()
    @IsString()
    type!: string;

    @ApiProperty()
    @IsString()
    assetId!: string;

    @ApiProperty()
    @IsNumber()
    quantity!: number;

    @ApiProperty()
    @IsNumber()
    price!: number;

    @ApiProperty()
    @IsDateString()
    timestamp!: string;

    @ApiProperty()
    @IsInt()
    userId!: number;

    @ApiProperty()
    @IsArray()
    asset!: [];

    @ApiProperty()
    @IsArray()
    user!: [];
}

export class GetAssetsResponseDto {
    @ApiProperty()
    @IsString()
    id!: string;

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    symbol!: string;

    @ApiProperty()
    @IsNumber()
    marketId!: number | null;

    @ApiProperty()
    @IsNumber()
    userId!: 6;

    @ApiProperty()
    @IsArray()
    user!: [];

    @ApiProperty()
    @IsArray()
    transactions!: [];
}