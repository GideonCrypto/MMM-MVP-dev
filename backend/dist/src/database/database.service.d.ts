import { PrismaService } from 'prisma/prisma.service';
export declare class DatabaseService {
    private prisma;
    constructor(prisma: PrismaService);
    private exportToCSV;
    exportAllToCSV(): Promise<string>;
    importCSV(modelName: string): Promise<void>;
    importAllFromCSV(): Promise<string>;
    private parseRow;
}
