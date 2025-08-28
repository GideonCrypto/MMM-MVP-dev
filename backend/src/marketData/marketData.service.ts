import { Injectable, InternalServerErrorException, RequestTimeoutException, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMarketDataDto, GetMarketDataDto } from './dto/marketData.dto';
import { CoingeckoService } from 'src/coinGecko/coinGecko.service';

@Injectable()
export class MarketDataService {
    private readonly logger = new Logger(MarketDataService.name);

    constructor(
        private prisma: PrismaService,
        private readonly coingeckoService: CoingeckoService,
    ) {}

    async getTopCoins() {
        const rawData = await this.coingeckoService.getTopCoins();
        return rawData;
    }

    async syncMarketData() {
        const TOTAL_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
        const STALL_TIMEOUT_MS = 5 * 60 * 1000;  // 5 min

        let lastChangeTime = Date.now();
        this.logger.log('Start sync job with CoinGecko...');

        let stalled = false;
        const watcher = setInterval(() => {
            if (Date.now() - lastChangeTime > STALL_TIMEOUT_MS) {
                stalled = true;
                this.logger.error(`No progress more than ${STALL_TIMEOUT_MS / 1000 / 60} min — stoping.`);
            }
        }, 10_000);

        try {
            return await Promise.race([
                (async () => {
                    const rawData = await this.coingeckoService.getMarketData((page, total) => {
                        lastChangeTime = Date.now(); // update progress
                        this.logger.log(`Sync progress: page ${page}, total ${total}`);
                    });

                    this.logger.log(`Received ${rawData.length} coins from CoinGecko.`);

                    const dtoData: CreateMarketDataDto[] = rawData.map((item) => new CreateMarketDataDto({
                        id: item.id,
                        symbol: item.symbol,
                        name: item.name,
                        image: item.image,
                        currentPrice: item.current_price,
                        marketCap: item.market_cap,
                        marketCapRank: item.market_cap_rank,
                        fullyDilutedValuation: item.fully_diluted_valuation,
                        totalVolume: item.total_volume,
                        high24h: item.high_24h,
                        low24h: item.low_24h,
                        priceChange24h: item.price_change_24h,
                        priceChangePercentage24h: item.price_change_percentage_24h,
                        marketCapChange24h: item.market_cap_change_24h,
                        marketCapChangePercentage24h: item.market_cap_change_percentage_24h,
                        circulatingSupply: item.circulating_supply,
                        totalSupply: item.total_supply,
                        maxSupply: item.max_supply,
                        ath: item.ath,
                        athChangePercentage: item.ath_change_percentage,
                        athDate: item.ath_date,
                        atl: item.atl,
                        atlChangePercentage: item.atl_change_percentage,
                        atlDate: item.atl_date,
                        lastUpdated: item.last_updated,
                        assetId: null,
                    }));

                    let processed = 0;
                    const chunkArray = <T,>(arr: T[], size: number) => {
                        const res: T[][] = [];
                        for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
                        return res;
                    };

                    const chunks = chunkArray(dtoData, 200);

                    let chunkIndex = 0;
                    for (const chunk of chunks) {
                        chunkIndex++;

                        if (stalled) {
                            throw new RequestTimeoutException('Sync stopped: no progress for 5 min');
                        }

                        this.logger.log(`Processing chunk ${chunkIndex}/${chunks.length} (lenght ${chunk.length})...`);
                        await this.upsertMany(chunk);
                        processed += chunk.length;
                        this.logger.log(`Total progress ${processed} data.`);

                        lastChangeTime = Date.now(); // update progress after upsert
                    }

                    clearInterval(watcher);
                    this.logger.log(`Sync compleated. All coins: ${processed}`);
                    return { status: 'ok', processed };
                })(),

                new Promise((_, reject) =>
                    setTimeout(() => {
                        this.logger.error('Sync failed: general time out 30m in.');
                        reject(new RequestTimeoutException('Sync timed out (30 minutes)'));
                    }, TOTAL_TIMEOUT_MS),
                ),
            ]);
        } catch (error) {
            clearInterval(watcher);
            if (error instanceof RequestTimeoutException) throw error;
            // @ts-ignore
            this.logger.error(`Sync error: ${error.message}`);
            throw new InternalServerErrorException('Unexpected error during sync');
        }
    }

    async upsertMany(dataArray: CreateMarketDataDto[]) {
        const upserts = dataArray.map((data) => {
            const input: any = {
                ...data,
                athDate: new Date(data.athDate),
                atlDate: new Date(data.atlDate),
                lastUpdated: new Date(data.lastUpdated),
            };

            for (const key in input) {
                if (input[key] === null) delete input[key];
            }

            return this.prisma.marketData.upsert({
                where: { id: data.id },
                create: input,
                update: input,
            });
        });

        await this.prisma.$transaction(upserts);
    }

    async findAll(query: GetMarketDataDto) {
        const {
            name,
            currentPrice,
            marketCap,
            high24h,
            low24h,
            priceChange24H,
            priceChangePercent24H,
            page,
            limit,
            orderBy,
            orderDirection,
        } = query;

        const filters: any = {};

        if (name) filters.name = { contains: name };
        if (currentPrice !== undefined) filters.currentPrice = currentPrice;
        if (marketCap !== undefined) filters.marketCap = marketCap;
        if (high24h !== undefined) filters.high24h = high24h;
        if (low24h !== undefined) filters.low24h = low24h;
        if (priceChange24H !== undefined) filters.priceChange24H = priceChange24H;
        if (priceChangePercent24H !== undefined) filters.priceChangePercent24H = priceChangePercent24H;

        const skip = (page - 1) * limit;

        const allowedOrderFields = [
            'name',
            'currentPrice',
            'marketCap',
            'high24h',
            'low24h',
            'priceChange24H',
            'priceChangePercent24H',
            'createdAt',
            'id',
        ];

        let order: { [key: string]: 'asc' | 'desc' } = { id: 'asc' };

        if (orderBy && allowedOrderFields.includes(orderBy)) {
            order = {
                [orderBy]: orderDirection === 'desc' ? 'desc' : 'asc',
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.marketData.findMany({
                where: filters,
                skip,
                take: limit,
                orderBy: order,
            }),
            this.prisma.marketData.count({ where: filters }),
        ]);

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async getAssetPrices(names: string[]) {
        const assetPrices = await this.prisma.marketData.findMany({
            where: {
                id: {
                    in: names,
                },
            },
        });

        return assetPrices.map(asset => ({
            assetName: asset.id,
            currentPrice: asset.currentPrice,
        }));
    }
}
