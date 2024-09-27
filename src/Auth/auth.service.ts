import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../Auth/dtos/create-user.dto';
import { LoginUserDto } from '../Auth/dtos/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>, 
        private readonly jwtService: JwtService) {}

    async createUser(createUserDto: CreateUserDto) {
        try {
            const {password,  ...rest} = createUserDto;
            const user = this.userRepository.create(
                {...rest,
                    password: bcrypt.hashSync(password, 10) 
        });
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            console.log("*********ERROR *******", error.code);
            this.handleDBExceptions(error);
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const {email, password} = loginUserDto;
        const user = await this.userRepository.findOne(
                {where:{email},
                select: {email: true, id: true, password:true}
            });

        if (!user){
            throw new UnauthorizedException('Invalid credentials (email)');
        }
        if (!bcrypt.compareSync(password, user.password)){
            throw new UnauthorizedException('Invalid credentials (password)');
        }


        return {...user, token: this.jwtService.sign({id: user.id})};
    }

    private  handleDBExceptions(error: any) {
        if(error.code === '23505') {
          throw new BadRequestException('User already exists');
        }
        throw new InternalServerErrorException(error.code);
      }
}