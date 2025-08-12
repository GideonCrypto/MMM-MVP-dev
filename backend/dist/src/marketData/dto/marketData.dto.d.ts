export declare class FindAllMarketData {
    id: string;
}
export declare class CreateMarketDataDto {
    constructor(partial: Partial<CreateMarketDataDto>);
    id: string;
    symbol: string;
    name: string;
    image: string;
    currentPrice: number;
    marketCap: number;
    marketCapRank: number;
    fullyDilutedValuation: number;
    totalVolume: number;
    high24h: number;
    low24h: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    marketCapChange24h: number;
    marketCapChangePercentage24h: number;
    circulatingSupply: number;
    totalSupply: number;
    maxSupply: string;
    ath: number;
    athChangePercentage: number;
    athDate: string;
    atl: number;
    atlChangePercentage: number;
    atlDate: string;
    lastUpdated: string;
    assetId?: string | null;
}
export declare class GetMarketDataDto {
    name?: string;
    currentPrice?: number;
    marketCap?: number;
    high24h?: number;
    low24h?: number;
    priceChange24H?: number;
    priceChangePercent24H?: number;
    page: number;
    limit: number;
    orderBy?: string;
    orderDirection: 'asc' | 'desc';
}
