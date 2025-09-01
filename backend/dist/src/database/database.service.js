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
        const marketData = await this.prisma.marketData.findMany();
        await this.exportToCSV('User', users);
        await this.exportToCSV('Asset', assets);
        await this.exportToCSV('Portfolio', portfolios);
        await this.exportToCSV('Transaction', transactions);
        await this.exportToCSV('MarketData', marketData);
        return '✅ All data exported to /exports';
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
                case 'marketdata':
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
                    marketdata: this.prisma.marketData,
                };
                const key = modelName.toLowerCase();
                if (!(key in modelMap)) {
                    throw new Error(`Model ${modelName} not found`);
                }
                const modelClient = modelMap[key];
                for (const row of rows) {
                    const data = this.parseRow(row, modelName);
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
        const order = ['User', 'Asset', 'Portfolio', 'Transaction', 'MarketData'];
        for (const model of order) {
            console.log(`📥 Import: ${model}`);
            await this.importCSV(model);
        }
        return '✅ All db import complete';
    }
    parseRow(row, modelName) {
        const parsed = { ...row };
        const schema = {
            user: {
                id: "number",
                name: "string",
                password: "string",
                createdAt: "date",
            },
            asset: {
                id: "string",
                name: "string",
                symbol: "string",
                marketId: "string",
                userId: "number",
            },
            portfolio: {
                id: "number",
                name: "string",
                userId: "number",
                createdAt: "date",
            },
            transaction: {
                id: "number",
                type: "string",
                assetId: "string",
                quantity: "float",
                price: "float",
                timestamp: "date",
                userId: "number",
                portfolioId: "number",
            },
            marketdata: {
                id: "string",
                symbol: "string",
                name: "string",
                image: "string",
                currentPrice: "float",
                marketCap: "float",
                marketCapRank: "number",
                fullyDilutedValuation: "float",
                totalVolume: "float",
                high24h: "float",
                low24h: "float",
                priceChange24h: "float",
                priceChangePercentage24h: "float",
                marketCapChange24h: "float",
                marketCapChangePercentage24h: "float",
                circulatingSupply: "float",
                totalSupply: "float",
                maxSupply: "float",
                ath: "float",
                athChangePercentage: "float",
                athDate: "date",
                atl: "float",
                atlChangePercentage: "float",
                atlDate: "date",
                lastUpdated: "date",
                assetId: "string",
            }
        };
        const modelSchema = schema[modelName.toLowerCase()];
        for (const key in parsed) {
            const value = parsed[key];
            if (value === 'null' || value === '') {
                parsed[key] = null;
                continue;
            }
            switch (modelSchema?.[key]) {
                case "number":
                    parsed[key] = Number(value);
                    break;
                case "float":
                    parsed[key] = parseFloat(value);
                    break;
                case "date":
                    parsed[key] = new Date(value);
                    break;
                case "string":
                    parsed[key] = String(value);
                    break;
                default:
                    parsed[key] = value;
            }
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