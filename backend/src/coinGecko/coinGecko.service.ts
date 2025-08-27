import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class CoingeckoService {
    private readonly logger = new Logger(CoingeckoService.name);

    async getTopCoins() {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
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

    async getMarketData(onProgress?: (page: number, total: number) => void): Promise<any[]> {
        const allData: any[] = [];
        let page = 1;
        const perPage = 200;

        while (true) {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page,
                    sparkline: false,
                },
            });

            const data = response.data;
            if (!data.length) break;

            allData.push(...data);

            // progress notification
            if (onProgress) {
                onProgress(page, allData.length);
            }
            this.logger.log(`Received page: ${page}, total coins: ${allData.length}`);

            if (data.length < perPage) break;

            page++;
            await delay(15000); // CoinGecko api limit
        }

        return allData;
    }
}