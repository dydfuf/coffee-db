export enum CoffeeInfoField {
  ID = "ID",
  NAME_EN = "이름(영어)",
  NAME_KR = "이름(한글)",
  REGION = "지역",
  FARM = "농장",
  VARIETY = "품종",
  PROCESS = "프로세싱",
  NOTE = "노트",
  SOURCE = "출처",
  USER_SUBMITTED = "유저제출",
  NATION = "국가",
  NOTE_FOR_FILTER = "노트(필터)",
  LAST_EDITED_TIME = "Last edited time",
}

export type CoffeeInfo = {
  [CoffeeInfoField.ID]: string;
  [CoffeeInfoField.NAME_EN]: string;
  [CoffeeInfoField.NAME_KR]: string;
  [CoffeeInfoField.REGION]: string;
  [CoffeeInfoField.FARM]: string;
  [CoffeeInfoField.VARIETY]: string;
  [CoffeeInfoField.PROCESS]: string;
  [CoffeeInfoField.NOTE]: string;
  [CoffeeInfoField.SOURCE]: string;
  [CoffeeInfoField.NATION]: string;
  [CoffeeInfoField.USER_SUBMITTED]?: number;
  [CoffeeInfoField.NOTE_FOR_FILTER]: string;
  [CoffeeInfoField.LAST_EDITED_TIME]?: string;
};
