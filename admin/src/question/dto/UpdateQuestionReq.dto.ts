export class UpdateQuestionReq {
  readonly title: string;

  readonly desc: string;

  readonly isDeleted: boolean;

  readonly isStar: boolean;

  readonly isPublished: boolean;

  readonly componentList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }[];
}
