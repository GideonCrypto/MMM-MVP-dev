import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: CreateUserDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        password: string;
    }>;
}
