import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { PortfolioService } from "./portfolio.service";
import { addPortfolioTagDto, createPortfolioDto, getPortfoliosDto } from "./dto/portfolio.dto";
import { TransactionResponseDto } from "src/transaction/dto/transaction.dto";

@Controller('portfolioData')
export class PortfolioController {
    constructor(private readonly service: PortfolioService) {}

    @Post('createPortfolio')
    @ApiOkResponse({
                description: 'Success',
                type: [createPortfolioDto],
            })
    async createPortfolio(@Body() addTransactionDto: createPortfolioDto) {
        try {
            const portfolio = await this.service.createPortfolio(addTransactionDto);
            return portfolio;
        } catch (error) {
            console.error('Create portfolio error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('addPortfolioTag')
    @ApiOkResponse({
                description: 'Success',
                type: [addPortfolioTagDto],
            })
    update(@Body() updateTransaction: addPortfolioTagDto) {
        try {
            const transaction = this.service.addPortfolioTag(updateTransaction);;
            return transaction;
        } catch (error) {
            console.error('Add portfolio tag error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Portfolio deleted successfully' })
    async deletePortfolioTag(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.deletePortfolioTag(id);
            return result;
        } catch (error) {
            console.error('Delete portfolio error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('portfolio/:id')
    @ApiOkResponse({
                description: 'Success',
                type: [getPortfoliosDto],
            })
    async getPortfolios(@Param('id', ParseIntPipe) id: number) {
        try {
            const portfolios = await this.service.getPortfolios(id);
            return portfolios;
        } catch (error) {
            console.error('Get portfolios error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('portfolioTransactions/:id')
    @ApiOkResponse({
                description: 'Success',
                type: [TransactionResponseDto],
            })
    async getPortfolioTransactions(@Param('id', ParseIntPipe) id: number) {
        try {
            const portfolioTransactions = await this.service.getPortfolioTransactions(id);
            return portfolioTransactions;
        } catch (error) {
            console.error('Get portfolio transactions error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}