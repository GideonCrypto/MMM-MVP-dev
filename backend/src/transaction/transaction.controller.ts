import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { AddTransactionDto, GetAssetsResponseDto, GetTransactionsDto, TransactionResponseDto, UpdateTransactionDto } from "./dto/transaction.dto";

@Controller('transactionData')
export class TransactionController {
    constructor(private readonly service: TransactionService) {}

    @Post('addTransaction')
    @ApiOkResponse({
                description: 'Success',
                type: [TransactionResponseDto],
            })
    async addTransaction(@Body() addTransactionDto: AddTransactionDto) {
        try {
            const transaction = await this.service.addTransaction(addTransactionDto);
            return transaction;
        } catch (error) {
            console.error('Create transaction error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('updateTransaction')
    @ApiOkResponse({
                description: 'Success',
                type: [TransactionResponseDto],
            })
    update(@Body() updateTransaction: UpdateTransactionDto) {
        try {
            const transaction = this.service.updateTransaction(updateTransaction);;
            return transaction;
        } catch (error) {
            console.error('Update transaction error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Transaction deleted successfully' })
    async deleteTransaction(@Param('id', ParseIntPipe) id: number) {
        console.log(id)
        try {
            const result = await this.service.deleteTransaction(id);
            return result;
        } catch (error) {
            console.error('Delete transaction error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('getTransaction')
    @ApiOkResponse({
                description: 'Success',
                type: [TransactionResponseDto],
            })
    async getTransactions(@Query() getTransactionsDto: GetTransactionsDto) {
        try {
            const transactions = await this.service.getTransactions(getTransactionsDto);
            return transactions;
        } catch (error) {
            console.error('Get transaction error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('getAssets/:userId')
    @ApiOkResponse({
                description: 'Success',
                type: [GetAssetsResponseDto],
            })
    async getAssets(@Param('userId', ParseIntPipe) userId: number) {
        try {
            const assets = await this.service.getAssets(userId);
            
            return assets;
        } catch (error) {
            console.error('Get assets error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}