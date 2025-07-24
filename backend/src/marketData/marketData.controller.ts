import { Controller, Get, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { MarketDataService } from './marketData.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateMarketDataDto, FindAllMarketData } from './dto/marketData.dto';

@Controller('marketData')
export class MarketDataController {
    constructor(private readonly service: MarketDataService) {}

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

    @Get(':ids')
    @ApiOkResponse({
        description: 'Success',
        type: [CreateMarketDataDto],
    })
    findAll(@Query('ids') ids: []) {
        try {
            if (ids instanceof Array) {
                return this.service.findAll(ids);
            } else {
                return this.service.findOne(ids);
            }
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
