import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { format } from '@fast-csv/format';
import * as fs from 'fs-extra';
import * as path from 'path';
import { parse } from '@fast-csv/parse';

@Injectable()
export class DatabaseService {
    constructor(private prisma: PrismaService,) {}

    private async exportToCSV(modelName: string, data: any[]) {
        const filePath = path.join(__dirname, '..', '..', 'exports', `${modelName}.csv`);
        await fs.ensureDir(path.dirname(filePath));
        const ws = fs.createWriteStream(filePath);
        const csvStream = format({ headers: true });
        csvStream.pipe(ws);
        data.forEach((item) => csvStream.write(item));
        csvStream.end();

        return filePath;
    }

    async exportAllToCSV() {
        const users = await this.prisma.user.findMany();
        const assets = await this.prisma.asset.findMany();
        const portfolios = await this.prisma.portfolio.findMany();
        const transactions = await this.prisma.transaction.findMany();

        await this.exportToCSV('User', users);
        await this.exportToCSV('Asset', assets);
        await this.exportToCSV('Portfolio', portfolios);
        await this.exportToCSV('Transaction', transactions);

        return '✅ All data exported too /exports';
    }


    async importCSV(modelName: string): Promise<void> {
        const filePath = path.join(__dirname, '..', '..', 'exports', `${modelName}.csv`);
        if (!(await fs.pathExists(filePath))) {
            console.warn(`⚠️ File not found : ${filePath}`);
            return;
        }

        const rows: any[] = [];

        const getUniqueKey = (modelName: string, data: any) => {
            switch (modelName.toLowerCase()) {
            case 'user':
            case 'portfolio':
            case 'transaction':
                return { id: Number(data.id) };
            case 'asset':
                return { id: data.id };
            default:
                throw new Error(`Unknown model for get key: ${modelName}`);
            }
        };

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
            .pipe(parse({ headers: true }))
            .on('error', reject)
            .on('data', (row) => rows.push(row))
            .on('end', async () => {
                const modelMap = {
                    user: this.prisma.user,
                    asset: this.prisma.asset,
                    portfolio: this.prisma.portfolio,
                    transaction: this.prisma.transaction,
                };

                const key = modelName.toLowerCase() as keyof typeof modelMap;

                if (!(key in modelMap)) {
                throw new Error(`Model ${modelName} not found`);
                }

                const modelClient = modelMap[key];

                for (const row of rows) {
                    const data = this.parseRow(row);

                    try {
                        const uniqueWhere = getUniqueKey(modelName, data);

                        await (modelClient as any).upsert({
                            where: uniqueWhere,
                            update: data,
                            create: data,
                        });
                    } catch (e) {
                        if (e instanceof Error) {
                            console.error(`❌ Error upsert in ${modelName}:`, e.message);
                        } else {
                            console.error(`❌ Error upsert in ${modelName}:`, e);
                        }
                    }
                }
                resolve();
            });
        });
    }

    async importAllFromCSV(): Promise<string> {
        const order = ['User', 'Asset', 'Portfolio', 'Transaction'];
        for (const model of order) {
            console.log(`📥 Import: ${model}`);
            await this.importCSV(model);
        }
        return '✅ All db import compleate';
    }

    private parseRow(row: any) {
        const parsed: any = { ...row };

        for (const key in parsed) {
            let value = parsed[key];
            
            if (value === 'null') {// null-string → null
                parsed[key] = null;
            } else if (value === '') {// '' → null
                parsed[key] = null; 
            } else if (!isNaN(value) && typeof value !== 'boolean') {// number
                parsed[key] = Number(value);
            } else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value)) {// ISO-string → new Date
            const date = new Date(value);
                if (!isNaN(date.getTime())) parsed[key] = date;
            } else if (typeof value === 'string') {
                const timestamp = Date.parse(value);
                if (!isNaN(timestamp)) {
                    parsed[key] = new Date(timestamp);
                }
            }
        }
        
        if ('password' in parsed && parsed.password !== null) {// password → string
            parsed.password = String(parsed.password);
        }

        return parsed;
    }
}

