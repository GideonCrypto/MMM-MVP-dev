"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntTransformPipe = void 0;
const common_1 = require("@nestjs/common");
let BigIntTransformPipe = class BigIntTransformPipe {
    transform(value, metadata) {
        const bigIntFields = [
            'marketCap',
            'fullyDilutedValuation',
            'totalVolume',
            'marketCapChange24h',
        ];
        for (const field of bigIntFields) {
            if (value[field] !== undefined && typeof value[field] === 'number') {
                value[field] = BigInt(value[field]);
            }
        }
        return value;
    }
};
exports.BigIntTransformPipe = BigIntTransformPipe;
exports.BigIntTransformPipe = BigIntTransformPipe = __decorate([
    (0, common_1.Injectable)()
], BigIntTransformPipe);
//# sourceMappingURL=bigintTransform.pipe.js.map