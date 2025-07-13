import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { GameMode } from '../models/GameMode';
import { BaseApiService } from './base-api.service';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class ApiGameService extends BaseApiService {
    private readonly http: HttpClient;
    constructor(http: HttpClient, langService: LangService) {
      super(langService);
      this.http = http;
    }

  startGame(gameMode: GameMode): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/games/${gameMode}/start`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  checkAnswer(
    gameMode: GameMode,
    gameToken: string,
    choiceIndex: number
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/games/${gameMode}/checkAnswer`,
      { gameToken, choiceIndex },
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  loadRanking(gameMode: GameMode): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/games/${gameMode}/ranking`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }
}
