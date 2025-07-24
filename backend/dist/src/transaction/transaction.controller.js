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
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
const swagger_1 = require("@nestjs/swagger");
const transaction_dto_1 = require("./dto/transaction.dto");
let TransactionController = class TransactionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async addTransaction(addTransactionDto) {
        try {
            const transaction = await this.service.addTransaction(addTransactionDto);
            return transaction;
        }
        catch (error) {
            console.error('Create transaction error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    update(updateTransaction) {
        try {
            const transaction = this.service.updateTransaction(updateTransaction);
            ;
            return transaction;
        }
        catch (error) {
            console.error('Update transaction error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async deleteTransaction(id) {
        console.log(id);
        try {
            const result = await this.service.deleteTransaction(id);
            return result;
        }
        catch (error) {
            console.error('Delete transaction error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
    async getTransactions(getTransactionsDto) {
        try {
            const transactions = await this.service.getTransactions(getTransactionsDto);
            return transactions;
        }
        catch (error) {
            console.error('Get transaction error:', error);
            throw new common_1.InternalServerErrorException('Unexpected error occurred');
        }
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Post)('addTransaction'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [transaction_dto_1.TransactionResponseDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.AddTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "addTransaction", null);
__decorate([
    (0, common_1.Patch)('updateTransaction'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [transaction_dto_1.TransactionResponseDto],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Transaction deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Get)('getTransaction'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: [transaction_dto_1.TransactionResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.GetTransactionsDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactions", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('transactionData'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map