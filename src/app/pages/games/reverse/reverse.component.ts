import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { UpperCasePipe } from '@angular/common';
import { ChronometerComponent } from "../../../components/games/chronometer/chronometer.component";
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameMode } from '../../../models/GameMode';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reverse',
  imports: [UpperCasePipe, ChronometerComponent],
  templateUrl: './reverse.component.html',
  styleUrl: './reverse.component.css',
})
export class ReverseComponent {
  authService = inject(AuthService);
  gameService = inject(GameService);

  get loadingCheckState(): string {
    return this.gameService.loadingCheckState;
  }

  get card(): Card | null {
    return this.gameService.card();
  }

  onCheck(choiceIndex: number, card: Card | null) {
    this.gameService.onCheck(choiceIndex, card!);
  }

  ngOnInit() {
    this.gameService.initGame(GameMode.REVERSE);
    this.gameService.resetGame();
    this.gameService.resetPostGameDatas();
    this.gameService.refreshRanking$.next();
  }
}
