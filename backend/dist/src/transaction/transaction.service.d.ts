import { PrismaService } from 'prisma/prisma.service';
import { AddTransactionDto, GetTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(transaction: AddTransactionDto): Promise<{
        id: number;
        type: string;
        assetId: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    updateTransaction(data: UpdateTransactionDto): Promise<{
        id: number;
        type: string;
        assetId: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    getTransactions(data: GetTransactionsDto): Promise<({
        asset: {
            symbol: string;
            id: string;
            userId: number;
            name: string;
            marketId: string | null;
        };
        user: {
            id: number;
            name: string;
            password: string;
            createdAt: Date;
        };
    } & {
        id: number;
        type: string;
        assetId: string;
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
            password: string;
            createdAt: Date;
        };
        transactions: {
            id: number;
            type: string;
            assetId: string;
            quantity: number;
            price: number;
            timestamp: Date;
            userId: number;
            portfolioId: number | null;
        }[];
    } & {
        symbol: string;
        id: string;
        userId: number;
        name: string;
        marketId: string | null;
    })[]>;
    deleteTransaction(transactionId: number): Promise<{
        message: string;
    }>;
}
