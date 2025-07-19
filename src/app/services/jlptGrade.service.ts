import { Injectable } from '@angular/core';
import { JlptGrade } from '../models/JlptGrade';

const JLPT_GRADE_LS_NAME = 'jlptGrade';

@Injectable({ providedIn: 'root' })
export class JlptStorageService {
  // Lecture depuis le localStorage
  get jlptGrade(): number | null {
    const value = localStorage.getItem(JLPT_GRADE_LS_NAME);
    return value ? Number(value) : null;
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
