import { inject, Injectable } from '@angular/core';
import { GameService } from './game.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChronoService {
  minutes = 0;
  secondes = 0;
  centiemes = 0;
  intervalId: any;
  enCours = false;

  // ici on va exposer un observable qui va permettre aux abonnés de récupérer le temps écoule en secondes
  private readonly _time$ = new BehaviorSubject<number>(0);
  // on expose time$
  time$ = this._time$.asObservable();

  private readonly gameService: GameService = inject(GameService);
  // on s'abonne aux événements du service de jeu pour démarrer, arrêter et réinitialiser le chrono
  constructor() {
    this.gameService.start$.subscribe(() => {
      //console.log('start$ trigger');
      this.startGame();
    });
    this.gameService.stop$.subscribe(() => this.stopGame());
    this.gameService.reset$.subscribe(() => this.reset());
  }

  private startGame() {
    if (!this.enCours) {
      this.enCours = true;
      this.intervalId = setInterval(() => {
        this.centiemes++;
        if (this.centiemes >= 100) {
          this.centiemes = 0;
          this.secondes++;
          if (this.secondes >= 60) {
            this.secondes = 0;
            this.minutes++;
          }
        }

        this._time$.next(this.getChrono());
      }, 10);
    }
  }

  private stopGame() {
    this.enCours = false;
    clearInterval(this.intervalId);

    this._time$.next(this.getChrono());
  }

  private reset() {
    this.stopGame();
    this.minutes = 0;
    this.secondes = 0;
    this.centiemes = 0;

    this._time$.next(this.getChrono());
  }

  private getChrono(): number {
    return this.minutes * 60 + this.secondes + this.centiemes / 100;
  }

  get chrono(): number {
    return this._time$.value;
  }
}
