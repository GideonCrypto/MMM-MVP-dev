import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddTransactionDto, GetTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async addTransaction(transaction: AddTransactionDto) {
        let asset = await this.prisma.asset.findUnique({ where: { id: transaction.assetId } });

        if (asset == null) {
            asset = await this.prisma.asset.create({
                data: {
                    id: transaction.assetId,
                    name: transaction.assetId,
                    symbol: transaction.assetId,
                    userId: transaction.userId,
                } as Prisma.AssetUncheckedCreateInput,
            });
        }

        const res = await this.prisma.transaction.create({
            data: {
                type: transaction.type,
                assetId: transaction.assetId,
                quantity: transaction.quantity,
                price: transaction.price,
                timestamp: new Date(transaction.timestamp),
                userId: transaction.userId,
            },
        });

        return res
    }

    async updateTransaction(data: UpdateTransactionDto) {
        const transaction = await this.prisma.transaction.update({
            where: {
                id: data.id,
            },
            data: {
                type: data.type,
                assetId: data.assetId,
                quantity: data.quantity,
                price: data.price,
                timestamp: new Date(data.timestamp),
            },
        });
        return transaction
    }

    async getTransactions(data: GetTransactionsDto) {
        const transactions = await this.prisma.transaction.findMany({
                where: {
                    assetId: data.assetId,
                    userId: data.userId,
                },
                include: {
                    user: true,
                    asset: true,
                },
            });
        return transactions
    }

    async getAssets(userId: number) {        
        const assets = await this.prisma.asset.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    user: true,
                    transactions: true,
                },
            });
        return assets
    }

    async deleteTransaction(transactionId: number) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            select: { assetId: true },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        const assetId = transaction.assetId;

        await this.prisma.transaction.delete({
            where: { id: transactionId },
        });

        const remaining = await this.prisma.transaction.count({
            where: { assetId },
        });

        if (remaining === 0) {
            await this.prisma.asset.delete({
            where: { id: assetId },
            });
        }

        return { message: 'Transaction deleted' };
    }
}
