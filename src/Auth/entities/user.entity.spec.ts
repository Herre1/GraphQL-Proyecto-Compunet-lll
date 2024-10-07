import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    // Inicializa un nuevo objeto User antes de cada prueba
    user = new User();
    user.id = '123e4567-e89b-12d3-a456-426614174000';
    user.email = 'test@example.com';
    user.password = 'hashedPassword123';
    user.roles = ['user'];
  });

  it('should be defined', () => {
    // Verifica que la entidad User esté definida
    expect(user).toBeDefined();
  });

  it('should have an id', () => {
    // Verifica que el usuario tenga un id
    expect(user.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should have an email', () => {
    // Verifica que el usuario tenga un email
    expect(user.email).toEqual('test@example.com');
  });

  it('should have a hashed password', () => {
    // Verifica que la contraseña esté almacenada de forma cifrada
    expect(user.password).toEqual('hashedPassword123');
  });

  it('should have roles', () => {
    // Verifica que el usuario tenga roles
    expect(user.roles).toContain('user');
  });
});
