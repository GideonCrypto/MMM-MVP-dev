import { Controller, Get, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { MarketDataService } from './marketData.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateMarketDataDto, GetMarketDataDto } from './dto/marketData.dto';

@Controller('marketData')
export class MarketDataController {
    constructor(private readonly service: MarketDataService) {}

    @Get('top')
    @ApiOkResponse({
        description: 'Success',
    })
    async top() {
        try {
            return this.service.getTopCoins();
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('sync')
    @ApiOkResponse({
        description: 'Success',
        type: [CreateMarketDataDto],
    })
    async sync() {
        try {
            return this.service.syncMarketData();
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('market')
    findAll(@Query() query: GetMarketDataDto) {
        return this.service.findAll(query);
    }
}
