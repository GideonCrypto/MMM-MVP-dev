import { PortfolioService } from "./portfolio.service";
import { addPortfolioTagDto, createPortfolioDto } from "./dto/portfolio.dto";
export declare class PortfolioController {
    private readonly service;
    constructor(service: PortfolioService);
    createPortfolio(addTransactionDto: createPortfolioDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        userId: number;
    }>;
    update(updateTransaction: addPortfolioTagDto): Promise<{
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    deletePortfolioTag(id: number): Promise<{
        message: string;
    }>;
    getPortfolios(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        userId: number;
    }[]>;
    getPortfolioTransactions(id: number): Promise<{
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }[]>;
}
