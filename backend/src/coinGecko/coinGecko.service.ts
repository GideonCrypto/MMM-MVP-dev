import { Injectable } from '@nestjs/common';
import axios from 'axios';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class CoingeckoService {
    async getMarketData(): Promise<any[]> {
        const allData: any[] = [];
        let page = 1;
        const perPage = 200;
        let count = 0;
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

            if (data.length < perPage) break;

            page++;

            // Задержка 15 секунда между запросами
            await delay(15000);
            
            console.log("get all coins "+count)
            count++
        }

        return allData;
    }
}