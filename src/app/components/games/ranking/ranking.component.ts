import { Component, inject, Input, input } from '@angular/core';
import { GameMode } from '../../../models/GameMode';
import { ApiGameService } from '../../../services/api.game.service';
import { UserChrono } from '../../../models/userChrono';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';
import { DatePipe, NgClass } from '@angular/common';
import { GameService } from '../../../services/game.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../services/lang.service';
import { JlptStorageService } from '../../../services/jlptStorage.service';
import { JlptGrade } from '../../../models/JlptGrade';

@Component({
  selector: 'app-ranking',
  imports: [ChronoFormatPipe, DatePipe, TranslateModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingComponent {
  @Input() gameMode!: GameMode;
  @Input() jlptGrade!: JlptGrade;

  metrics = {
    nbLimitRanking: 0,
    totalChronos: 0,
  };
  userBestChrono: UserChrono | null = null;
  chronos: UserChrono[] | null = null;

  private readonly apiGameService = inject(ApiGameService);
  private readonly gameService = inject(GameService);
  private readonly jlptStorageService = inject(JlptStorageService);

  ngOnInit() {
    //this.loadRanking();
    this.gameService.refreshRanking$.subscribe(() => {
      this.loadRanking();
    });
  }

  loadRanking() {
    const jlptLevel = this.jlptStorageService.jlptGrade ?? JlptGrade.N5;
    this.apiGameService.loadRanking(this.gameMode, jlptLevel).subscribe({
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
