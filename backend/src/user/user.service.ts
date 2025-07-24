import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,) {}

    async createUser(data: CreateUserDto){
        const name = data.name
        const userRes = await this.prisma.user.findFirst({ where: { name } });

        if (userRes) {
            throw new UnauthorizedException('User name exist');
        } else {
            return await this.prisma.user.create({
                data: {
                    name: data.name,
                    password: data.password,
                },
            });
        }
    }
}
