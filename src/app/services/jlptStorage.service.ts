import { Injectable } from "@angular/core";
import { JlptGrade } from "../models/JlptGrade";

const JLPT_GRADE_LS_NAME = 'jlptGrade';

@Injectable({ providedIn: 'root' })
export class JlptStorageService {
  // Lecture depuis le localStorage
  get jlptGrade(): JlptGrade | null {
    const value = localStorage.getItem(JLPT_GRADE_LS_NAME);
    if (
      value === '5' ||
      value === '4' ||
      value === '3' ||
      value === '2' ||
      value === '1'
    ) {
      return Number(value) as JlptGrade;
    }
    return null;
  }

  // Ecriture dans le localStorage
  set jlptGrade(grade: JlptGrade | null) {
    if (grade !== null && grade !== undefined) {
      localStorage.setItem(JLPT_GRADE_LS_NAME, String(grade));
    } else {
      localStorage.removeItem(JLPT_GRADE_LS_NAME);
    }
  }
}
