"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TransactionService = class TransactionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addTransaction(transaction) {
        let asset = await this.prisma.asset.findUnique({ where: { id: transaction.assetId } });
        if (asset == null) {
            asset = await this.prisma.asset.create({
                data: {
                    id: transaction.assetId,
                    name: transaction.assetId,
                    symbol: transaction.assetId,
                    userId: transaction.userId,
                },
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
                portfolioId: transaction.portfolioId,
            },
        });
        return res;
    }
    async updateTransaction(data) {
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
                portfolioId: data.portfolioId,
            },
        });
        return transaction;
    }
    async getTransactions(data) {
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
        return transactions;
    }
    async getAssets(userId) {
        const assets = await this.prisma.asset.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true,
                transactions: true,
            },
        });
        return assets;
    }
    async deleteTransaction(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            select: { assetId: true },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
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
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map