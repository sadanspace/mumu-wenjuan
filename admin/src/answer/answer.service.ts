import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schemas/answer.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel('Answer') private readonly answerModel: Model<Answer>,
  ) {}

  async create(answerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷id', HttpStatus.BAD_REQUEST);
    }
    return await this.answerModel.create(answerInfo);
  }

  async count(questionId: string) {
    if (!questionId) return 0;
    return await this.answerModel.countDocuments({ questionId });
  }

  async findAll(
    questionId: string,
    opt: { pageNum: number; pageSize: number },
  ) {
    if (!questionId) return [];

    const { pageSize = 10, pageNum = 1 } = opt;
    const list = await this.answerModel
      .find({ questionId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return list;
  }
}
