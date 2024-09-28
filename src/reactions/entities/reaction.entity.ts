import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reaction extends Document {
  @Prop({ type: String, ref: 'User', required: true })  // Relación con el usuario
  user: string;

  @Prop({ type: String, ref: 'Comment', required: true })  // Relación con el comentario
  comment: string;

  @Prop({ required: true })
  type: string;  // Tipo de reacción (like, dislike, etc.)
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);