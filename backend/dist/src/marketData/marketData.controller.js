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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataController = void 0;
const common_1 = require("@nestjs/common");
const marketData_service_1 = require("./marketData.service");
const swagger_1 = require("@nestjs/swagger");
const marketData_dto_1 = require("./dto/marketData.dto");
let MarketDataController = class MarketDataController {
    service;
    constructor(service) {
        this.service = service;
    }
    async top() {
        try {
            return this.service.getTopCoins();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async sync() {
        try {
            return this.service.syncMarketData();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    findAll(query) {
        try {
            return this.service.findAll(query);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    getAssetPrices(names) {
        try {
            const assetList = names.split(',').map(name => name.trim());
            return this.service.getAssetPrices(assetList);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
};
exports.MarketDataController = MarketDataController;
__decorate([
    (0, common_1.Get)('top'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "top", null);
__decorate([
    (0, common_1.Get)('sync'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [marketData_dto_1.CreateMarketDataDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "sync", null);
__decorate([
    (0, common_1.Get)('market'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marketData_dto_1.GetMarketDataDto]),
    __metadata("design:returntype", void 0)
], MarketDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assetPrice'),
    __param(0, (0, common_1.Query)('names')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketDataController.prototype, "getAssetPrices", null);
exports.MarketDataController = MarketDataController = __decorate([
    (0, common_1.Controller)('marketData'),
    __metadata("design:paramtypes", [marketData_service_1.MarketDataService])
], MarketDataController);
//# sourceMappingURL=marketData.controller.js.map