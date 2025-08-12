import { TransactionService } from "./transaction.service";
import { AddTransactionDto, GetTransactionsDto, UpdateTransactionDto } from "./dto/transaction.dto";
export declare class TransactionController {
    private readonly service;
    constructor(service: TransactionService);
    addTransaction(addTransactionDto: AddTransactionDto): Promise<{
        id: number;
        type: string;
        assetId: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    update(updateTransaction: UpdateTransactionDto): Promise<{
        id: number;
        type: string;
        assetId: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    deleteTransaction(id: number): Promise<{
        message: string;
    }>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<({
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
}
