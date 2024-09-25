import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: String, ref: 'User', required: true })
  author: string;  

  @Prop({ type: String, ref: 'Comment', default: null })
  parentComment?: string;  

  @Prop({ type: [String], ref: 'Comment', default: [] })
  replies: string[];  

  @Prop({ type: [String], ref: 'Reaction', default: [] })  
  reactions: string[];  

  @Prop({ default: 0 })
  reactionsCount: number;  
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
