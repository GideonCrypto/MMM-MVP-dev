import {
    IsString,
    IsUrl,
    IsNumber,
    IsOptional,
    IsDateString,
    IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllMarketData {
    @IsString()
    @ApiProperty()
    id!: string;
}

export class CreateMarketDataDto {
    constructor(partial: Partial<CreateMarketDataDto>) {
        Object.assign(this, partial);
    }

    @IsString()
    @ApiProperty()
    id!: string;

    @IsString()
    @ApiProperty()
    symbol!: string;

    @IsString()
    @ApiProperty()
    name!: string;

    @IsUrl()
    @ApiProperty()
    image!: string;

    @IsNumber()
    @ApiProperty()
    currentPrice!: number;

    @IsNumber()
    @ApiProperty()
    marketCap!: number;

    @IsInt()
    @ApiProperty()
    marketCapRank!: number;

    @IsNumber()
    @ApiProperty()
    fullyDilutedValuation!: number;

    @IsNumber()
    @ApiProperty()
    totalVolume!: number;

    @IsNumber()
    @ApiProperty()
    high24h!: number;

    @IsNumber()
    @ApiProperty()
    low24h!: number;

    @IsNumber()
    @ApiProperty()
    priceChange24h!: number;

    @IsNumber()
    @ApiProperty()
    priceChangePercentage24h!: number;

    @IsNumber()
    @ApiProperty()
    marketCapChange24h!: number;

    @IsNumber()
    @ApiProperty()
    marketCapChangePercentage24h!: number;

    @IsNumber()
    @ApiProperty()
    circulatingSupply!: number;

    @IsNumber()
    @ApiProperty()
    totalSupply!: number;

    @IsNumber()
    @ApiProperty()
    maxSupply!: string;

    @IsNumber()
    @ApiProperty()
    ath!: number;

    @IsNumber()
    @ApiProperty()
    athChangePercentage!: number;

    @IsDateString()
    @ApiProperty()
    athDate!: string;

    @IsNumber()
    @ApiProperty()
    atl!: number;

    @IsNumber()
    @ApiProperty()
    atlChangePercentage!: number;

    @IsDateString()
    @ApiProperty()
    atlDate!: string;

    @IsDateString()
    @ApiProperty()
    lastUpdated!: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    assetId?: string | null;
}