import { DatabaseService } from './database.service';
import { Response } from 'express';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    exportAll(res: Response): Promise<Response<any, Record<string, any>>>;
    importAll(res: Response): Promise<Response<any, Record<string, any>>>;
}
