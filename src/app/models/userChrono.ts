import { JlptGrade } from "./JlptGrade";

export type UserChrono = {
  chronoValue: number,
  jlptGrade: JlptGrade,
  ranking: number,
  username: string,
  nationality: string,
  createdAt: Date,
};