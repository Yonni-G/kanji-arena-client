import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameMode } from '../models/GameMode';
import { BaseApiService } from './base-api.service';
import { LangService } from './lang.service';
import { JlptGrade } from '../models/JlptGrade';
import { PracticeModeService } from './practice-mode.service';

@Injectable({
  providedIn: 'root',
})
export class ApiGameService extends BaseApiService {
  private readonly http: HttpClient;
  private mode: 'chrono' | 'training' = 'chrono';
  constructor(http: HttpClient, langService: LangService, practiceModeService: PracticeModeService) {
    super(langService);
    this.http = http;
    // Subscribe to the practice mode service to get the current mode
    practiceModeService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  startGame(gameMode: GameMode, jlptGrade: JlptGrade | null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/games/${gameMode}/${jlptGrade}/start`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  checkAnswer(
    gameMode: GameMode,
    gameToken: string,
    choiceIndex: number,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/games/${gameMode}/checkAnswer`,
      { gameToken, choiceIndex, mode: this.mode },
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  loadRanking(gameMode: GameMode, jlptGrade: JlptGrade): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/games/${gameMode}/${jlptGrade}/ranking`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }
}
