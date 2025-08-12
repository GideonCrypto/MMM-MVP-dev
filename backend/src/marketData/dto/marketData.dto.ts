import {
    IsString,
    IsUrl,
    IsNumber,
    IsOptional,
    IsDateString,
    IsInt,
    Min,
    IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class GetMarketDataDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    currentPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    marketCap?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    high24h?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    low24h?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    priceChange24H?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    priceChangePercent24H?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiProperty({ required: false })
    @Min(1)
    limit: number = 10;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, enum: ['name', 'currentPrice', 'marketCap', 'high24h', 'low24h', 'priceChange24H', 'priceChangePercent24H'] })
    orderBy?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    @ApiProperty({ required: false, enum: ['asc', 'desc'] })
    orderDirection: 'asc' | 'desc' = 'asc';
}