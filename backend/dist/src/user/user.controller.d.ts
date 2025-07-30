import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly service;
    constructor(service: UserService);
    createUser(createUserDto: CreateUserDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        password: string;
    }>;
}
