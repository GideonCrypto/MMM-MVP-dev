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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_dto_1 = require("./dto/auth.dto");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(user) {
        const dbRes = await this.getUser(user);
        const payload = { sub: dbRes.id, name: dbRes.name };
        return {
            ...dbRes,
            access_token: this.jwtService.sign(payload),
        };
    }
    async getUser(user) {
        const name = user.name;
        const userRes = await this.prisma.user.findFirst({ where: { name } });
        if (!userRes) {
            throw new common_1.UnauthorizedException('User not found');
        }
        let isPasswordValid = false;
        if (userRes?.password === user.password) {
            isPasswordValid = true;
        }
        else {
            throw new common_1.UnauthorizedException('Wrong password');
        }
        const dto = new auth_dto_1.GetUserDto();
        dto.id = userRes.id.toString();
        dto.name = userRes.name;
        dto.createdAt = userRes.createdAt;
        return dto;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map