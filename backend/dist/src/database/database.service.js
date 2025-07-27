"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const format_1 = require("@fast-csv/format");
const fs = require("fs-extra");
const path = require("path");
const parse_1 = require("@fast-csv/parse");
let DatabaseService = class DatabaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportToCSV(modelName, data) {
        const filePath = path.join(__dirname, '..', '..', 'exports', `${modelName}.csv`);
        await fs.ensureDir(path.dirname(filePath));
        const ws = fs.createWriteStream(filePath);
        const csvStream = (0, format_1.format)({ headers: true });
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
    async importCSV(modelName) {
        const filePath = path.join(__dirname, '..', '..', 'exports', `${modelName}.csv`);
        if (!(await fs.pathExists(filePath))) {
            console.warn(`⚠️ File not found : ${filePath}`);
            return;
        }
        const rows = [];
        const getUniqueKey = (modelName, data) => {
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
                .pipe((0, parse_1.parse)({ headers: true }))
                .on('error', reject)
                .on('data', (row) => rows.push(row))
                .on('end', async () => {
                const modelMap = {
                    user: this.prisma.user,
                    asset: this.prisma.asset,
                    portfolio: this.prisma.portfolio,
                    transaction: this.prisma.transaction,
                };
                const key = modelName.toLowerCase();
                if (!(key in modelMap)) {
                    throw new Error(`Model ${modelName} not found`);
                }
                const modelClient = modelMap[key];
                for (const row of rows) {
                    const data = this.parseRow(row);
                    try {
                        const uniqueWhere = getUniqueKey(modelName, data);
                        await modelClient.upsert({
                            where: uniqueWhere,
                            update: data,
                            create: data,
                        });
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            console.error(`❌ Error upsert in ${modelName}:`, e.message);
                        }
                        else {
                            console.error(`❌ Error upsert in ${modelName}:`, e);
                        }
                    }
                }
                resolve();
            });
        });
    }
    async importAllFromCSV() {
        const order = ['User', 'Asset', 'Portfolio', 'Transaction'];
        for (const model of order) {
            console.log(`📥 Import: ${model}`);
            await this.importCSV(model);
        }
        return '✅ All db import compleate';
    }
    parseRow(row) {
        const parsed = { ...row };
        for (const key in parsed) {
            let value = parsed[key];
            if (value === 'null') {
                parsed[key] = null;
            }
            else if (value === '') {
                parsed[key] = null;
            }
            else if (!isNaN(value) && typeof value !== 'boolean') {
                parsed[key] = Number(value);
            }
            else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value)) {
                const date = new Date(value);
                if (!isNaN(date.getTime()))
                    parsed[key] = date;
            }
            else if (typeof value === 'string') {
                const timestamp = Date.parse(value);
                if (!isNaN(timestamp)) {
                    parsed[key] = new Date(timestamp);
                }
            }
        }
        if ('password' in parsed && parsed.password !== null) {
            parsed.password = String(parsed.password);
        }
        return parsed;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map