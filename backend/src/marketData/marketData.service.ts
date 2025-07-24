import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMarketDataDto, FindAllMarketData } from './dto/marketData.dto';
import { CoingeckoService } from 'src/coinGecko/coinGecko.service';

@Injectable()
export class MarketDataService {
    constructor(private prisma: PrismaService, private readonly coingeckoService: CoingeckoService,) {}
    async syncMarketData() {
        const rawData = await this.coingeckoService.getMarketData();

        const dtoData: CreateMarketDataDto[] = rawData.map((item) => {
            return new CreateMarketDataDto({
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
            });
        });

        return this.upsertMany(dtoData);
    }

    async upsertMany(dataArray: CreateMarketDataDto[]) {
        function chunkArray<T>(array: T[], size: number): T[][] {
            const result: T[][] = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        }

        const chunks = chunkArray(dataArray, 200); // по 200 записей

        for (const chunk of chunks) {
            const upserts = chunk.map((data) => {
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

            await this.prisma.$transaction(upserts); // транзакция на 200 штук
        }
    }

    async findAll(data: string[]): Promise<FindAllMarketData[]> {
        const res = await this.prisma.marketData.findMany({
            where: {
                id: {
                    in: data,
                },
            },
        });
        return res
    }

    async findOne(id: string) {
        let res = await this.prisma.marketData.findUnique({ where: { id } });
        return res ;
    }
}
