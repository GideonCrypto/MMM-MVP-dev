import { MarketDataService } from './marketData.service';
import { GetMarketDataDto } from './dto/marketData.dto';
export declare class MarketDataController {
    private readonly service;
    constructor(service: MarketDataService);
    top(): Promise<any>;
    sync(): Promise<unknown>;
    findAll(query: GetMarketDataDto): Promise<{
        data: {
            symbol: string;
            id: string;
            name: string;
            image: string | null;
            currentPrice: number | null;
            marketCap: number | null;
            marketCapRank: number | null;
            fullyDilutedValuation: number | null;
            totalVolume: number | null;
            high24h: number | null;
            low24h: number | null;
            priceChange24h: number | null;
            priceChangePercentage24h: number | null;
            marketCapChange24h: number | null;
            marketCapChangePercentage24h: number | null;
            circulatingSupply: number | null;
            totalSupply: number | null;
            maxSupply: number | null;
            ath: number | null;
            athChangePercentage: number | null;
            athDate: Date | null;
            atl: number | null;
            atlChangePercentage: number | null;
            atlDate: Date | null;
            lastUpdated: Date | null;
            assetId: string | null;
        }[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    getAssetPrices(names: string): Promise<{
        assetName: string;
        currentPrice: number | null;
    }[]>;
}
