import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ collection: 'answer', timestamps: true })
export class Answer {
  @Prop({ required: true })
  questionId: string;

  @Prop()
  answerList: {
    componentFeId: string;
    value: string[];
  }[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
