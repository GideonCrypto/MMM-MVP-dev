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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PortfolioService = class PortfolioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPortfolio(portfolio) {
        const res = await this.prisma.portfolio.create({
            data: {
                name: portfolio.name,
                createdAt: new Date(portfolio.createdAt),
                userId: portfolio.userId,
            },
        });
        return res;
    }
    async addPortfolioTag(data) {
        const transaction = await this.prisma.transaction.update({
            where: {
                id: data.transactionId,
            },
            data: {
                portfolioId: data.id
            },
        });
        return transaction;
    }
    async deletePortfolioTag(id) {
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
    async getPortfolios(id) {
        const transactions = await this.prisma.portfolio.findMany({
            where: {
                userId: id,
            }
        });
        return transactions;
    }
    async getPortfolioTransactions(id) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                portfolioId: id,
            }
        });
        return transactions;
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map