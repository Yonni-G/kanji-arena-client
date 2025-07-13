// classic.component.ts
import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { Card } from '../../../models/Card';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { GameMode } from '../../../models/GameMode';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-classic',
  imports: [UpperCasePipe, TranslateModule],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent {

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

    this.gameService.initGame(GameMode.CLASSIC);
    this.gameService.resetGame();
    this.gameService.resetPostGameDatas();
    this.gameService.refreshRanking$.next();
  }
}
