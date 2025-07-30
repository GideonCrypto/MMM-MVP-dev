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
exports.GetMarketDataDto = exports.CreateMarketDataDto = exports.FindAllMarketData = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class FindAllMarketData {
    id;
}
exports.FindAllMarketData = FindAllMarketData;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindAllMarketData.prototype, "id", void 0);
class CreateMarketDataDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
    id;
    symbol;
    name;
    image;
    currentPrice;
    marketCap;
    marketCapRank;
    fullyDilutedValuation;
    totalVolume;
    high24h;
    low24h;
    priceChange24h;
    priceChangePercentage24h;
    marketCapChange24h;
    marketCapChangePercentage24h;
    circulatingSupply;
    totalSupply;
    maxSupply;
    ath;
    athChangePercentage;
    athDate;
    atl;
    atlChangePercentage;
    atlDate;
    lastUpdated;
    assetId;
}
exports.CreateMarketDataDto = CreateMarketDataDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "currentPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "marketCap", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "marketCapRank", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "fullyDilutedValuation", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "totalVolume", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "high24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "low24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "priceChange24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "priceChangePercentage24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "marketCapChange24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "marketCapChangePercentage24h", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "circulatingSupply", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "totalSupply", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "maxSupply", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "ath", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "athChangePercentage", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "athDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "atl", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateMarketDataDto.prototype, "atlChangePercentage", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "atlDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateMarketDataDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CreateMarketDataDto.prototype, "assetId", void 0);
class GetMarketDataDto {
    name;
    currentPrice;
    marketCap;
    high24h;
    low24h;
    priceChange24H;
    priceChangePercent24H;
    page = 1;
    limit = 10;
    orderBy;
    orderDirection = 'asc';
}
exports.GetMarketDataDto = GetMarketDataDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetMarketDataDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "currentPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "marketCap", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "high24h", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "low24h", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "priceChange24H", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "priceChangePercent24H", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetMarketDataDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: false, enum: ['name', 'currentPrice', 'marketCap', 'high24h', 'low24h', 'priceChange24H', 'priceChangePercent24H'] }),
    __metadata("design:type", String)
], GetMarketDataDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    (0, swagger_1.ApiProperty)({ required: false, enum: ['asc', 'desc'] }),
    __metadata("design:type", String)
], GetMarketDataDto.prototype, "orderDirection", void 0);
//# sourceMappingURL=marketData.dto.js.map