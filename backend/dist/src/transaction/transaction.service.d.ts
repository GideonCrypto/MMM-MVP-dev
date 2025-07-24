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
            password: string;
            createdAt: Date;
        };
        asset: {
            symbol: string;
            id: string;
            name: string;
            userId: number;
            marketId: string | null;
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
    deleteTransaction(transactionId: number): Promise<{
        message: string;
    }>;
}
