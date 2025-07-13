import { Component, inject, Input, input } from '@angular/core';
import { GameMode } from '../../../models/GameMode';
import { ApiGameService } from '../../../services/api.game.service';
import { UserChrono } from '../../../models/userChrono';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';
import { DatePipe, NgClass } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../services/lang.service';

@Component({
  selector: 'app-ranking',
  imports: [ChronoFormatPipe, DatePipe, TranslateModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingComponent {

  @Input() gameMode!: GameMode;

  metrics = {
    nbLimitRanking: 0,
    totalChronos: 0,
  };
  userBestChrono: UserChrono | null = null;
  chronos: UserChrono[] | null = null;

  private readonly apiGameService = inject(ApiGameService);
  private readonly gameService = inject(GameService);

  ngOnInit() {
    //this.loadRanking();
    this.gameService.refreshRanking$.subscribe(() => {
      this.loadRanking();
    });
  }

  loadRanking() {
    this.apiGameService.loadRanking(this.gameMode).subscribe({
      next: (data) => {
        //console.log('Classement chargé', data);
        this.userBestChrono = data.userBestChrono;
        this.chronos = data.chronos;
        this.metrics = data.metrics;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du classement', error);
      },
    });
  }
}
