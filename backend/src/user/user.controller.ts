import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/user.dto';

@Controller('userData')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post('createUser')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateUserDto],
        })
    createUser(@Body() createUserDto: CreateUserDto) {
        try {
            return this.service.createUser(createUserDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
