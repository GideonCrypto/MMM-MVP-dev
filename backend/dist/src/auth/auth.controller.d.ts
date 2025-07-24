import { AuthService } from "./auth.service";
import { AuthUserDto } from "./dto/auth.dto";
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    login(loginDto: AuthUserDto): Promise<{
        access_token: string;
        name: string;
        id: string;
        createdAt: Date;
    }>;
}
