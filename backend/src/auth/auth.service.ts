import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto, GetUserDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async login(user: AuthUserDto) {
        const dbRes = await this.getUser(user)
        const payload = { sub: dbRes.id, name: dbRes.name };

        return {
            ...dbRes,
            access_token: this.jwtService.sign(payload),
        };
    }

    async getUser(user: AuthUserDto) :Promise <GetUserDto> {
        const name = user.name
        const userRes = await this.prisma.user.findFirst({ where: { name } });

        if (!userRes) {
            throw new UnauthorizedException('User not found');
        }

        let isPasswordValid = false;
        if (userRes?.password === user.password) {
            isPasswordValid = true
        } else {
            throw new UnauthorizedException('Wrong password');
        }

        const dto = new GetUserDto();
            dto.id = userRes.id.toString();
            dto.name = userRes.name;
            dto.createdAt = userRes.createdAt;
        return dto
    }
}
