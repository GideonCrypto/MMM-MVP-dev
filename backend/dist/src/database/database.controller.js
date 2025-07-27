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
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
let DatabaseController = class DatabaseController {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async exportAll(res) {
        try {
            const result = await this.databaseService.exportAllToCSV();
            return res.status(common_1.HttpStatus.OK).json({ message: result });
        }
        catch (err) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
        }
    }
    async importAll(res) {
        try {
            const result = await this.databaseService.importAllFromCSV();
            return res.status(common_1.HttpStatus.OK).json({ message: result });
        }
        catch (err) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
        }
    }
};
exports.DatabaseController = DatabaseController;
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "exportAll", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "importAll", null);
exports.DatabaseController = DatabaseController = __decorate([
    (0, common_1.Controller)('database'),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
//# sourceMappingURL=database.controller.js.map