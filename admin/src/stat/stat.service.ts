import { Injectable } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  private _getRadioOptText(value, props: any = {}) {
    const { options = [] } = props;
    const length = options.length;
    for (let i = 0; i < length; i++) {
      const item = options[i];
      if (item.value === value) {
        return item.text;
      }
    }
    return '';
  }
  private _getCheckboxOptText(value, props: any = {}) {
    const { list = [] } = props;
    const length = list.length;

    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (item.value === value) {
        return item.text;
      }
    }
    return '';
  }

  /**
   * 生成答案信息，格式如 { componentFeId1: value1, componentFeId2: value2 ...}
   * @param question
   * @param answerList
   * @private
   */
  private _genAnswersInfo(question, answerList = []) {
    const res = {};
    const { componentList = [] } = question;

    answerList.forEach((a) => {
      const { componentFeId, value = [] } = a;
      // 获取组件信息
      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
      const { type, props = {} } = comp;
      if (type === 'questionRadio') {
        //单选
        res[componentFeId] = value
          .map((v) => this._getRadioOptText(v, props))
          .toString();
      } else if (type === 'questionCheckbox') {
        //多选
        res[componentFeId] = value
          .map((v) => this._getCheckboxOptText(v, props))
          .toString();
      } else {
        //其他
        res[componentFeId] = value.toString();
      }
    });
    return res;
  }

  // 获取单个问卷的答卷列表（分页）和数量
  async getQuestionStatListAndCount(
    questionId: string,
    opt: { pageNum: number; pageSize: number },
  ) {
    const noData = { list: [], total: 0 };
    if (!questionId) return noData;

    const q = await this.questionService.getQuestion(questionId);
    if (q === null) return noData;

    const total = await this.answerService.count(questionId);
    if (total === 0) return noData;

    const answers = await this.answerService.findAll(questionId, opt);

    const list = answers.map((a) => {
      return {
        _id: a._id,
        ...this._genAnswersInfo(q, a.answerList),
      };
    });

    return {
      list,
      total,
    };
  }

  // 获取单个组件的统计数据
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    // 获取问卷
    const q = await this.questionService.getQuestion(questionId);
    if (q === null) return [];

    // 获取组件
    const { componentList = [] } = q;

    const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
    if (comp === null) return [];

    const { type, props } = comp;
    if (type !== 'questionRadio' && type !== 'questionCheckbox') {
      // 单组件，只统计单选和多选，其他不统计
      return [];
    }

    // 获取答卷列表
    const total = await this.answerService.count(questionId);
    if (total === 0) return [];
    const answers = await this.answerService.findAll(questionId, {
      pageNum: 1,
      pageSize: total, // 全量获取
    });

    // 累加各个value数量
    const countInfo = {};
    answers.forEach((a) => {
      const { answerList = [] } = a;
      answerList.forEach((a) => {
        if (a.componentFeId !== componentFeId) return;
        a.value.forEach((v) => {
          if (!countInfo[v]) countInfo[v] = 0;
          countInfo[v]++;
        });
      });
    });

    // 整理数据
    const list = [];
    for (const val in countInfo) {
      // 根据val计算text
      let text = '';
      if (type === 'questionRadio') {
        text = this._getRadioOptText(val, props);
      }
      if (type === 'questionCheckbox') {
        text = this._getCheckboxOptText(val, props);
      }

      list.push({
        name: text,
        count: countInfo[val],
      });
    }
    return list;
  }
}
