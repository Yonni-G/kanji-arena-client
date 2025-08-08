// game-mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const MODE_KEY = 'practiceMode'; // Clé unique de stockage

@Injectable({ providedIn: 'root' })
export class PracticeModeService {
  private readonly modeSubject: BehaviorSubject<'chrono' | 'training'>;

  constructor() {
    // Récupère la valeur du localStorage ou défaut à 'chrono'
    const savedMode =
      (localStorage.getItem(MODE_KEY) as 'chrono' | 'training') || 'chrono';
    this.modeSubject = new BehaviorSubject<'chrono' | 'training'>(savedMode);
  }

  get mode$() {
    return this.modeSubject.asObservable();
  }

  setMode(mode: 'chrono' | 'training') {
    this.modeSubject.next(mode);
    localStorage.setItem(MODE_KEY, mode);
  }
}
