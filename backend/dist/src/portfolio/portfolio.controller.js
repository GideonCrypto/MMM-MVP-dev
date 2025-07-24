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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const portfolio_service_1 = require("./portfolio.service");
const portfolio_dto_1 = require("./dto/portfolio.dto");
const transaction_dto_1 = require("../transaction/dto/transaction.dto");
let PortfolioController = class PortfolioController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createPortfolio(addTransactionDto) {
        try {
            const portfolio = await this.service.createPortfolio(addTransactionDto);
            return portfolio;
        }
        catch (error) {
            console.error('Create portfolio error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    update(updateTransaction) {
        console.log(updateTransaction);
        try {
            const transaction = this.service.addPortfolioTag(updateTransaction);
            ;
            return transaction;
        }
        catch (error) {
            console.error('Add portfolio tag error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async deletePortfolioTag(id) {
        try {
            const result = await this.service.deletePortfolioTag(id);
            return result;
        }
        catch (error) {
            console.error('Delete portfolio error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async getPortfolios(id) {
        try {
            const portfolios = await this.service.getPortfolios(id);
            return portfolios;
        }
        catch (error) {
            console.error('Get portfolios error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async getPortfolioTransactions(id) {
        try {
            const portfolioTransactions = await this.service.getPortfolioTransactions(id);
            return portfolioTransactions;
        }
        catch (error) {
            console.error('Get portfolio transactions error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Post)('createPortfolio'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [portfolio_dto_1.createPortfolioDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [portfolio_dto_1.createPortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "createPortfolio", null);
__decorate([
    (0, common_1.Patch)('addPortfolioTag'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [portfolio_dto_1.addPortfolioTagDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [portfolio_dto_1.addPortfolioTagDto]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Portfolio deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "deletePortfolioTag", null);
__decorate([
    (0, common_1.Get)('portfolio/:id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [portfolio_dto_1.getPortfoliosDto],
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolios", null);
__decorate([
    (0, common_1.Get)('portfolioTransactions/:id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [transaction_dto_1.TransactionResponseDto],
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolioTransactions", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, common_1.Controller)('portfolioData'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map