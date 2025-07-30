"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const marketData_dto_1 = require("./dto/marketData.dto");
const coinGecko_service_1 = require("../coinGecko/coinGecko.service");
let MarketDataService = class MarketDataService {
    prisma;
    coingeckoService;
    constructor(prisma, coingeckoService) {
        this.prisma = prisma;
        this.coingeckoService = coingeckoService;
    }
    async getTopCoins() {
        const rawData = await this.coingeckoService.getTopCoins();
        return rawData;
    }
    async syncMarketData() {
        const rawData = await this.coingeckoService.getMarketData();
        const dtoData = rawData.map((item) => {
            return new marketData_dto_1.CreateMarketDataDto({
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
    async upsertMany(dataArray) {
        function chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        }
        const chunks = chunkArray(dataArray, 200);
        for (const chunk of chunks) {
            const upserts = chunk.map((data) => {
                const input = {
                    ...data,
                    athDate: new Date(data.athDate),
                    atlDate: new Date(data.atlDate),
                    lastUpdated: new Date(data.lastUpdated),
                };
                for (const key in input) {
                    if (input[key] === null)
                        delete input[key];
                }
                return this.prisma.marketData.upsert({
                    where: { id: data.id },
                    create: input,
                    update: input,
                });
            });
            await this.prisma.$transaction(upserts);
        }
    }
    async findAll(query) {
        const { name, currentPrice, marketCap, high24h, low24h, priceChange24H, priceChangePercent24H, page, limit, orderBy, orderDirection, } = query;
        const filters = {};
        if (name)
            filters.name = { contains: name };
        if (currentPrice !== undefined)
            filters.currentPrice = currentPrice;
        if (marketCap !== undefined)
            filters.marketCap = marketCap;
        if (high24h !== undefined)
            filters.high24h = high24h;
        if (low24h !== undefined)
            filters.low24h = low24h;
        if (priceChange24H !== undefined)
            filters.priceChange24H = priceChange24H;
        if (priceChangePercent24H !== undefined)
            filters.priceChangePercent24H = priceChangePercent24H;
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
        let order = { id: 'asc' };
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
};
exports.MarketDataService = MarketDataService;
exports.MarketDataService = MarketDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, coinGecko_service_1.CoingeckoService])
], MarketDataService);
//# sourceMappingURL=marketData.service.js.map