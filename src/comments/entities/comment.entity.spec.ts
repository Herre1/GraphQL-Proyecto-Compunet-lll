import { Comment } from './comment.entity';
import { User } from '../../auth/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

describe('Comment Entity', () => {
  let comment: Comment;

  beforeEach(() => {
    // Inicializa un nuevo objeto Comment antes de cada prueba
    comment = new Comment();
    comment.id = '123e4567-e89b-12d3-a456-426614174000';
    comment.content = 'Este es un comentario de prueba';
    comment.reactionsCount = 0;
    comment.author = new User(); 
    comment.contentId = new Content(); 
    comment.replies = [];
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
  });

  it('should be defined', () => {
    // Verifica que la entidad Comment esté definida
    expect(comment).toBeDefined();
  });

  it('should have an id', () => {
    // Verifica que el comentario tenga un id
    expect(comment.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should have content', () => {
    // Verifica que el comentario tenga contenido
    expect(comment.content).toEqual('Este es un comentario de prueba');
  });

  it('should have a reactionsCount', () => {
    // Verifica que el comentario tenga un conteo de reacciones
    expect(comment.reactionsCount).toEqual(0);
  });

  it('should have an author', () => {
    // Verifica que el comentario tenga un autor
    expect(comment.author).toBeDefined();
  });

  it('should have contentId', () => {
    // Verifica que el comentario esté relacionado con un contenido
    expect(comment.contentId).toBeDefined();
  });

  it('should have replies', () => {
    // Verifica que el comentario pueda tener respuestas
    expect(comment.replies).toEqual([]);
  });

  it('should have createdAt date', () => {
    // Verifica que el comentario tenga una fecha de creación
    expect(comment.createdAt).toBeInstanceOf(Date);
  });

  it('should have updatedAt date', () => {
    // Verifica que el comentario tenga una fecha de actualización
    expect(comment.updatedAt).toBeInstanceOf(Date);
  });
});