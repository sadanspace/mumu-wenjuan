import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QueryQuestionReq } from './dto/QueryQuestionReq.dto';
import { UpdateQuestionReq } from './dto/UpdateQuestionReq.dto';
import { nanoid } from 'nanoid';
import { Public } from '../auth/decorators/public.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Public()
  @Get(':id')
  async getQuestion(@Param('id') id: string): Promise<any> {
    return await this.questionService.getQuestion(id);
  }

  @Get('/')
  async getQuestionList(
    @Query() queryQuestionReq: QueryQuestionReq,
    @Request() req,
  ) {
    const { username: author } = req.user;
    const list = await this.questionService.findQuestion(
      queryQuestionReq,
      author,
    );
    const total = await this.questionService.findQuestionCount(
      queryQuestionReq,
      author,
    );

    return {
      list: list,
      total: total,
    };
  }

  @Post('/')
  async createQuestion(@Request() req): Promise<any> {
    const { username } = req.user;

    const createQuestionReq = {
      title: '问卷标题' + nanoid(),
      desc: '问卷描述',
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          isHidden: false,
          isLocked: false,
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    };

    return await this.questionService.createQuestion(
      createQuestionReq,
      username,
    );
  }

  @Patch(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionReq: UpdateQuestionReq,
    @Request() req,
  ): Promise<any> {
    const { username: author } = req.user;
    return await this.questionService.updateQuestion(
      id,
      author,
      updateQuestionReq,
    );
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string, @Request() req): Promise<any> {
    const { username: author } = req.user;
    return await this.questionService.deleteQuestion(id, author);
  }

  @Delete('/')
  async deleteManyQuestion(
    @Body() ids: string[],
    @Request() req,
  ): Promise<any> {
    const { username: author } = req.user;
    return await this.questionService.deleteManyQuestion(ids, author);
  }

  @Post('/duplicate/:id')
  async duplicateQuestion(
    @Param('id') id: string,
    @Request() req,
  ): Promise<any> {
    const { username: author } = req.user;
    return await this.questionService.duplicate(id, author);
  }
}
