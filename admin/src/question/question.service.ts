import { Injectable } from '@nestjs/common';
import { CreateQuestionReqDto } from './dto/CreateQuestionReq.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import mongoose, { Model } from 'mongoose';
import { QueryQuestionReq } from './dto/QueryQuestionReq.dto';
import { UpdateQuestionReq } from './dto/UpdateQuestionReq.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async createQuestion(
    createQuestionReq: CreateQuestionReqDto,
    username: string,
  ) {
    return await this.questionModel.create({
      author: username,
      ...createQuestionReq,
    });
  }

  async getQuestion(id: string) {
    return this.questionModel.findOne({ _id: id });
  }

  async findQuestion(queryQuestionReq: QueryQuestionReq, author: string) {
    const {
      pageNum,
      pageSize,
      keyword,
      isStar,
      isPublished,
      isDeleted = false,
    } = queryQuestionReq;

    const filter = {
      title: { $regex: '.*' + keyword + '.*' },
      author,
      isDeleted,
    };

    if (isStar) {
      filter['isStar'] = isStar;
    }

    if (isPublished) {
      filter['isPublished'] = isPublished;
    }

    return await this.questionModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async findQuestionCount(queryQuestionReq: QueryQuestionReq, author: string) {
    const {
      keyword,
      isStar,
      isPublished,
      isDeleted = false,
    } = queryQuestionReq;

    const filter = {
      title: { $regex: '.*' + keyword + '.*' },
      author,
      isDeleted,
    };

    if (isStar) {
      filter['isStar'] = isStar;
    }

    if (isPublished) {
      filter['isPublished'] = isPublished;
    }

    return await this.questionModel.find(filter).countDocuments();
  }

  async updateQuestion(
    id: string,
    author: string,
    updateQuestionReq: UpdateQuestionReq,
  ) {
    console.log(updateQuestionReq);
    return await this.questionModel.findOneAndUpdate(
      { _id: id, author },
      updateQuestionReq,
    );
  }

  async deleteQuestion(id: string, author: string) {
    return await this.questionModel.findOneAndDelete({ _id: id, author });
  }

  async deleteManyQuestion(ids: string[], author: any): Promise<any> {
    return await this.questionModel.deleteMany({
      _id: { $in: ids },
      author,
    });
  }

  async duplicate(id: string, author: string) {
    const loadedQuestion = await this.questionModel.findOne({
      _id: id,
      author,
    });

    return await this.questionModel.create({
      ...loadedQuestion.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: loadedQuestion.title + ' 副本',
      author,
      isPublished: false,
      isStar: false,
      componentList: loadedQuestion.componentList.map((component) => {
        return {
          ...component,
          fe_id: nanoid(),
        };
      }),
    });
  }
}
