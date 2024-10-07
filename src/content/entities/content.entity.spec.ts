import { Content } from './content.entity';
import { ContentType } from '../enums/content-type.enum'; // Asegúrate de importar ContentType

describe('Content Entity', () => {
  let content: Content;

  beforeEach(() => {
    // Inicializa un nuevo objeto Content antes de cada prueba
    content = new Content();
    content.id = '123e4567-e89b-12d3-a456-426614174000';
    content.title = 'Test Movie';
    content.genre = ['Drama', 'Action'];
    content.year = 2023;
    content.actors = ['Actor One', 'Actor Two'];
    content.description = 'This is a test movie description.';
    content.rating = 8.5;
    content.type = ContentType.MOVIE; 
    content.director = 'Director Name';
    content.seasons = 1;
    content.episodes = 10;
    content.studio = 'Test Studio';
    content.productionCompany = 'Test Production Company';
  });

  it('should be defined', () => {
    // Verifica que la entidad Content esté definida
    expect(content).toBeDefined();
  });

  it('should have an id', () => {
    // Verifica que el contenido tenga un id
    expect(content.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should have a title', () => {
    // Verifica que el contenido tenga un título
    expect(content.title).toEqual('Test Movie');
  });

  it('should have genres', () => {
    // Verifica que el contenido tenga géneros
    expect(content.genre).toContain('Drama');
    expect(content.genre).toContain('Action');
  });

  it('should have a year', () => {
    // Verifica que el contenido tenga un año
    expect(content.year).toEqual(2023);
  });

  it('should have a description', () => {
    // Verifica que el contenido tenga una descripción
    expect(content.description).toEqual('This is a test movie description.');
  });

  it('should have a rating', () => {
    // Verifica que el contenido tenga un rating
    expect(content.rating).toEqual(8.5);
  });

  it('should have a type', () => {
    // Verifica que el contenido tenga un tipo
    expect(content.type).toEqual(ContentType.MOVIE); 
  });

  it('should have a director', () => {
    // Verifica que el contenido tenga un director
    expect(content.director).toEqual('Director Name');
  });

  it('should have optional properties', () => {
    // Verifica las propiedades opcionales
    expect(content.seasons).toEqual(1);
    expect(content.episodes).toEqual(10);
    expect(content.studio).toEqual('Test Studio');
    expect(content.productionCompany).toEqual('Test Production Company');
  });
});
