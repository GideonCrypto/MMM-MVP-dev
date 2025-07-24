import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { addPortfolioTagDto, createPortfolioDto } from './dto/portfolio.dto';

@Injectable()
export class PortfolioService {
    constructor(private prisma: PrismaService) {}

    async createPortfolio(portfolio: createPortfolioDto) {    
        const res = await this.prisma.portfolio.create({
            data: {
                name: portfolio.name,
                createdAt: new Date(portfolio.createdAt),
                userId: portfolio.userId,
            },
        });

        return res
    }

    async addPortfolioTag(data: addPortfolioTagDto) {
        const transaction = await this.prisma.transaction.update({
            where: {
                id: data.transactionId,
            },
            data: {
                portfolioId: data.id
            },
        });

        return transaction
    }

    async deletePortfolioTag(id: number) {
        await this.prisma.transaction.updateMany({
            where: {
                portfolioId: id,
            },
            data: {
                portfolioId: null,
            },
        });

        await this.prisma.portfolio.delete({
            where: {
                id: id,
            },
        });

        return { message: 'Portfolio deleted' };
    }

    async getPortfolios(id: number) {
        const transactions = await this.prisma.portfolio.findMany({
                where: {
                    userId: id,
                }
            });
        return transactions
    }

    async getPortfolioTransactions(id: number) {
        const transactions = await this.prisma.transaction.findMany({
                where: {
                    portfolioId: id,
                }
            });
        return transactions
    }
}
