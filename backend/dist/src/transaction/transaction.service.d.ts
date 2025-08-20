import { PrismaService } from 'prisma/prisma.service';
import { AddTransactionDto, GetTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(transaction: AddTransactionDto): Promise<{
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    updateTransaction(data: UpdateTransactionDto): Promise<{
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    getTransactions(data: GetTransactionsDto): Promise<({
        user: {
            id: number;
            name: string;
            createdAt: Date;
            password: string;
        };
        asset: {
            symbol: string;
            id: string;
            name: string;
            marketId: string | null;
            userId: number;
        };
    } & {
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    })[]>;
    getAssets(userId: number): Promise<({
        user: {
            id: number;
            name: string;
            createdAt: Date;
            password: string;
        };
        transactions: {
            id: number;
            assetId: string;
            type: string;
            quantity: number;
            price: number;
            timestamp: Date;
            userId: number;
            portfolioId: number | null;
        }[];
    } & {
        symbol: string;
        id: string;
        name: string;
        marketId: string | null;
        userId: number;
    })[]>;
    deleteTransaction(transactionId: number): Promise<{
        message: string;
    }>;
}
