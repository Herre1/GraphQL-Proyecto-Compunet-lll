import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../Auth/guards/user-role.guard';
import { GetUser } from './decorators/get-user/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/Auth.decorator';

@Controller('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
       return this.authService.loginUser(loginUserDto);
    }

    @Get('routeprotected1')
    @UseGuards(AuthGuard()) // Verificar si esta en JWT
    routeProtected1() {
        return 'This route is protected';
    }

    @Get('routeprotected2')
    //@SetMetadata(META_ROLES, [ValidRoles.admin, ValidRoles.user])
    @RoleProtected(ValidRoles.admin, ValidRoles.user)
    @UseGuards(AuthGuard(), UserRoleGuard)
    routeProtected2(@Req() req) {
        console.log(req.user);
        return 'This route is protected';
    }

    @Get('routeprotected4')
    @Auth(ValidRoles.admin)
    routeProtected4(@Req() req) {
        console.log(req.user);
        return 'This route is protected';
    }


    @Get('routeprotected3')
    @UseGuards(AuthGuard())
    routeProtected3(@GetUser() user) {
        console.log(user);
        return 'This route is protected';
    }
}