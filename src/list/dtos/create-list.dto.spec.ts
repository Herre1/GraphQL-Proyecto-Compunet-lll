import { validate } from 'class-validator';
import { CreateListDto } from './create-list.dto';

describe('CreateListDto', () => {

  it('should validate a valid DTO', async () => {
    const dto = new CreateListDto();
    dto.userId = 'fe84fa84-ffc8-4eb1-b1ea-11993722904e'; // ID de usuario válido
    dto.contentIds = ['6ec58cc1-c89f-4a10-9b52-7943a42a4261']; // ID de contenido válido
    dto.status = 'active';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No debería haber errores de validación
  });

  it('should fail validation for invalid userId', async () => {
    const dto = new CreateListDto();
    dto.userId = 'invalid-uuid'; // ID inválido
    dto.contentIds = ['6ec58cc1-c89f-4a10-9b52-7943a42a4261'];
    dto.status = 'active';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Debería haber errores de validación
    expect(errors[0].constraints.isUuid).toBeDefined(); // Verifica que el error sea por UUID inválido
  });

  it('should fail validation for empty contentIds', async () => {
    const dto = new CreateListDto();
    dto.userId = 'fe84fa84-ffc8-4eb1-b1ea-11993722904e';
    dto.contentIds = []; // Lista vacía
    dto.status = 'active';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Debería haber errores de validación
    expect(errors[0].constraints.arrayNotEmpty).toBeDefined(); // Verifica que el error sea por lista vacía
  });

  it('should accept valid contentIds and status', async () => {
    const dto = new CreateListDto();
    dto.userId = 'fe84fa84-ffc8-4eb1-b1ea-11993722904e';
    dto.contentIds = ['6ec58cc1-c89f-4a10-9b52-7943a42a4261']; // ID de contenido válido
    dto.status = 'active';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No debería haber errores de validación
  });

});