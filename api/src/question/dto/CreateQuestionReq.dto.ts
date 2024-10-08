export class CreateQuestionReqDto {
  readonly title: string;

  readonly desc: string;

  readonly componentList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }[];
}
