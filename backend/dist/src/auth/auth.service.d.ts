import { JwtService } from '@nestjs/jwt';
import { AuthUserDto, GetUserDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(user: AuthUserDto): Promise<{
        access_token: string;
        name: string;
        id: string;
        createdAt: Date;
    }>;
    getUser(user: AuthUserDto): Promise<GetUserDto>;
}
