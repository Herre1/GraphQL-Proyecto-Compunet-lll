import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

jest.mock('bcrypt'); // Mock de bcrypt

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    // Mock de bcrypt.hashSync
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true); // Asume que la comparación de contraseñas es exitosa
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and save user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const savedUser = { id: 'someId', ...createUserDto, password: 'hashedPassword' };
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await authService.createUser(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword', // Verifica que se usó la contraseña "hasheada"
      });
      expect(bcrypt.hashSync).toHaveBeenCalledWith('Password123!', 10); // Verifica que hashSync fue llamado correctamente
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw a BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(authService.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an InternalServerErrorException for other errors', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      mockUserRepository.save.mockRejectedValue({ code: 'other-error' });

      await expect(authService.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('loginUser', () => {
    it('should throw UnauthorizedException if email is not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john@example.com',
        password: 'WrongPassword',
      };

      const user = {
        id: 'someId',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false); // Simula que la contraseña es incorrecta

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and token if credentials are valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john@example.com',
        password: 'Password123!',
      };

      const user = {
        id: 'someId',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('jwtToken');

      const result = await authService.loginUser(loginUserDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'someId',
          email: 'john@example.com',
          token: 'jwtToken',
        }),
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id });
    });
  });
});