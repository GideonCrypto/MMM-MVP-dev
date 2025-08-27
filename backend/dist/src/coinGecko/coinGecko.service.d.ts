export declare class CoingeckoService {
    private readonly logger;
    getTopCoins(): Promise<any>;
    getMarketData(onProgress?: (page: number, total: number) => void): Promise<any[]>;
}
