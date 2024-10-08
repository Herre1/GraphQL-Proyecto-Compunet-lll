import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../Auth/guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    createUser: jest.fn((dto: CreateUserDto) => {
      return {
        id: 'someId',
        ...dto,
        password: undefined, // Simulando la respuesta, sin devolver el password
      };
    }),
    loginUser: jest.fn((dto: LoginUserDto) => {
      return {
        id: 'someId',
        token: 'jwtToken',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const result = await authController.createUser(dto);
      expect(result).toEqual({
        id: 'someId',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: undefined, // No debería devolver el password
      });
      expect(authService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a JWT token', async () => {
      const dto: LoginUserDto = {
        email: 'john@example.com',
        password: 'Password123!',
      };
      const result = await authController.loginUser(dto);
      expect(result).toEqual({
        id: 'someId',
        token: 'jwtToken',
      });
      expect(authService.loginUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('routeProtected1', () => {
    it('should return a protected message', () => {
      const result = authController.routeProtected1();
      expect(result).toBe('This route is protected');
    });
  });

  describe('routeProtected2', () => {
    it('should return a protected message with user roles', () => {
      const req = { user: { id: 'someId', roles: ['admin', 'user'] } };
      const result = authController.routeProtected2(req);
      expect(result).toBe('This route is protected');
    });
  });

  describe('routeProtected4', () => {
    it('should return a protected message with admin role', () => {
      const req = { user: { id: 'someId', roles: ['admin'] } };
      const result = authController.routeProtected4(req);
      expect(result).toBe('This route is protected');
    });
  });

  describe('routeProtected3', () => {
    it('should return a protected message with user data', () => {
      const user = { id: 'someId', fullName: 'John Doe', roles: ['user'] };
      const result = authController.routeProtected3(user);
      expect(result).toBe('This route is protected');
    });
  });
});