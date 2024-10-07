import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new UpdateUserDto();
    dto.fullName = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'Password123!';
    dto.isActive = true;
    dto.roles = ['user'];

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No debería haber errores de validación
  });

  it('should fail validation for invalid email', async () => {
    const dto = new UpdateUserDto();
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Debería haber errores de validación
    expect(errors[0].constraints.isEmail).toEqual('El email debe ser un correo válido');
  });

  it('should fail validation for password length', async () => {
    const dto = new UpdateUserDto();
    dto.password = 'short'; // Contraseña demasiado corta

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Debería haber errores de validación
  });

  it('should fail validation for fullName length', async () => {
    const dto = new UpdateUserDto();
    dto.fullName = 'Jo'; // Nombre demasiado corto

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Debería haber errores de validación
  });

  it('should accept optional properties', async () => {
    const dto = new UpdateUserDto(); // Sin propiedades

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No debería haber errores de validación
  });
});
