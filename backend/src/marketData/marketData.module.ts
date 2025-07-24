import { Module } from '@nestjs/common';
import { MarketDataController } from './marketData.controller';
import { MarketDataService } from './marketData.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CoingeckoService } from 'src/coinGecko/coinGecko.service';

@Module({
    imports: [PrismaModule],
    controllers: [MarketDataController],
    providers: [MarketDataService, CoingeckoService],
})
export class MarketDataModule {}
