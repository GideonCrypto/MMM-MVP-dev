"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CoingeckoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoingeckoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let CoingeckoService = CoingeckoService_1 = class CoingeckoService {
    logger = new common_1.Logger(CoingeckoService_1.name);
    async getTopCoins() {
        const response = await axios_1.default.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false,
            },
        });
        return response.data;
    }
    async getMarketData(onProgress) {
        const allData = [];
        let page = 1;
        const perPage = 200;
        while (true) {
            const response = await axios_1.default.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page,
                    sparkline: false,
                },
            });
            const data = response.data;
            if (!data.length)
                break;
            allData.push(...data);
            if (onProgress) {
                onProgress(page, allData.length);
            }
            this.logger.log(`Received page: ${page}, total coins: ${allData.length}`);
            if (data.length < perPage)
                break;
            page++;
            await delay(15000);
        }
        return allData;
    }
};
exports.CoingeckoService = CoingeckoService;
exports.CoingeckoService = CoingeckoService = CoingeckoService_1 = __decorate([
    (0, common_1.Injectable)()
], CoingeckoService);
//# sourceMappingURL=coinGecko.service.js.map