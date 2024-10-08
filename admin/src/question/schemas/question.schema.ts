import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ collection: 'question', timestamps: true })
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  js: string;

  @Prop()
  css: string;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  componentList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }[];

  @Prop({ required: true })
  author: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
