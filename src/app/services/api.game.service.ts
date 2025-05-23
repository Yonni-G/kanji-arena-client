import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { GameMode } from '../models/GameMode';

@Injectable({
  providedIn: 'root',
})
export class ApiGameService {
  constructor(private readonly http: HttpClient) {}

  startGame(gameMode: GameMode): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/games/${gameMode}/start`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  checkAnswer(
    gameMode: GameMode,
    gameToken: string,
    choiceIndex: number
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/games/${gameMode}/checkAnswer`,
      { gameToken, choiceIndex },
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }

  loadRanking(gameMode: GameMode): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/games/${gameMode}/ranking`,
      { withCredentials: true } // 👈 ajoute les cookies
    );
  }
}
