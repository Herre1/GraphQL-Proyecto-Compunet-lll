import { Reaction } from './reaction.entity';
import { User } from '../../auth/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ReactionType } from '../enums/reaction-type.enum';

describe('Reaction Entity', () => {

  it('should create a Reaction instance with correct properties', () => {
    const mockUser = new User();
    mockUser.id = 'user-uuid';

    const mockComment = new Comment();
    mockComment.id = 'comment-uuid';

    const reaction = new Reaction();
    reaction.id = 'reaction-uuid';
    reaction.user = mockUser;
    reaction.comment = mockComment;
    reaction.type = ReactionType.LIKE;
    reaction.createdAt = new Date('2024-10-06T00:00:00');
    reaction.updatedAt = new Date('2024-10-06T00:00:00');

    expect(reaction).toBeDefined();
    expect(reaction.id).toBe('reaction-uuid');
    expect(reaction.user).toEqual(mockUser);
    expect(reaction.comment).toEqual(mockComment);
    expect(reaction.type).toBe(ReactionType.LIKE);
    expect(reaction.createdAt).toEqual(new Date('2024-10-06T00:00:00'));
    expect(reaction.updatedAt).toEqual(new Date('2024-10-06T00:00:00'));
  });

  it('should have correct default timestamps', () => {
    const reaction = new Reaction();

    const currentTime = new Date();
    expect(reaction.createdAt).toBeDefined();
    expect(reaction.updatedAt).toBeDefined();

    // Verificar que las marcas de tiempo estén cerca del tiempo actual (±1 segundo de diferencia)
    expect(Math.abs(reaction.createdAt.getTime() - currentTime.getTime())).toBeLessThan(1000);
    expect(Math.abs(reaction.updatedAt.getTime() - currentTime.getTime())).toBeLessThan(1000);
  });
});
