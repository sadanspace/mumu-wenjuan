import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get(':questionId')
  async getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('pageNum') pageNum: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.statService.getQuestionStatListAndCount(questionId, {
      pageNum,
      pageSize,
    });
  }

  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string,
  ) {
    const stat = await this.statService.getComponentStat(
      questionId,
      componentFeId,
    );
    return { stat };
  }
}
