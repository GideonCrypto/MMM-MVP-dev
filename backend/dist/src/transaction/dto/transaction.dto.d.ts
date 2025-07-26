export declare class AddTransactionDto {
    type: string;
    assetId: string;
    quantity: number;
    price: number;
    timestamp: string;
    userId: number;
    portfolioId: number;
}
export declare class UpdateTransactionDto extends AddTransactionDto {
    id: number;
}
export declare class GetTransactionsDto {
    assetId: string;
    userId: number;
}
export declare class TransactionResponseDto {
    type: string;
    assetId: string;
    quantity: number;
    price: number;
    timestamp: string;
    userId: number;
    asset: [];
    user: [];
}
export declare class GetAssetsResponseDto {
    id: string;
    name: string;
    symbol: string;
    marketId: number | null;
    userId: 6;
    user: [];
    transactions: [];
}
