export class QueryQuestionReq {
  readonly pageSize: number;
  readonly pageNum: number;
  readonly keyword: string;
  readonly isPublished: boolean;
  readonly isStar: boolean;
  readonly isDeleted: boolean;
}
