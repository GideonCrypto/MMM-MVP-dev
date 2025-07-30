import { TransactionService } from "./transaction.service";
import { AddTransactionDto, GetTransactionsDto, UpdateTransactionDto } from "./dto/transaction.dto";
export declare class TransactionController {
    private readonly service;
    constructor(service: TransactionService);
    addTransaction(addTransactionDto: AddTransactionDto): Promise<{
        id: number;
        assetId: string;
        type: string;
        quantity: number;
        price: number;
        timestamp: Date;
        userId: number;
        portfolioId: number | null;
    }>;
    update(updateTransaction: UpdateTransactionDto): Promise<{
        id: number;
        assetId: string;
        type: string;
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
        userId: number;
        marketId: string | null;
    })[]>;
}
