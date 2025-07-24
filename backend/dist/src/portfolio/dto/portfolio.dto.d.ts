export declare class createPortfolioDto {
    name: string;
    createdAt: string;
    userId: number;
}
export declare class addPortfolioTagDto {
    id: number | null;
    transactionId: number;
    userId: number;
}
export declare class getPortfoliosDto {
    id: number;
    name: string;
    createdAt: string;
    userId: number;
}
