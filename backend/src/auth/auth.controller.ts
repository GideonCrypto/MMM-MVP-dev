import { Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUserDto, GetUserDto } from "./dto/auth.dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller('userData')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('login')
    @ApiOkResponse({
                description: 'Success',
                type: [GetUserDto],
            })
    async login(@Body() loginDto: AuthUserDto) {
        try {
            const user = await this.service.login(loginDto);
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}