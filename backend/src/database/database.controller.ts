import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Response } from 'express';

@Controller('database')
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Get('export')
    async exportAll(@Res() res: Response) {
        try {
            const result = await this.databaseService.exportAllToCSV();
            return res.status(HttpStatus.OK).json({ message: result });
        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
        }
    }

    @Post('import')
    async importAll(@Res() res: Response) {
        try {
            const result = await this.databaseService.importAllFromCSV();
            return res.status(HttpStatus.OK).json({ message: result });
        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
        }
    }
}
