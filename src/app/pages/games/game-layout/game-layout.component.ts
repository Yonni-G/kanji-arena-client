import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  RouterOutlet,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';
import { GameMode } from '../../../models/GameMode';
import { RankingComponent } from '../../../components/games/ranking/ranking.component';
import { ListErrorsComponent } from '../../../components/games/list-errors/list-errors.component';
import { GameService } from '../../../services/game.service';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';
import { ModalComponent } from '../../../components/modal/modal.component';
import { Card } from '../../../models/Card';
import { NgClass } from '@angular/common';
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { JlptSelectorComponent } from '../../../components/games/jlpt-selector/jlpt-selector.component';
import { JlptGrade } from '../../../models/JlptGrade';
import { JlptStorageService } from '../../../services/jlptStorage.service';
import { ChronoTrainingSelectorComponent } from "../../../components/games/chrono-training-selector/chrono-training-selector.component";
import { ChronoTrainingLayoutComponent } from "../../../components/games/chrono-training-layout/chrono-training-layout.component";

@Component({
  selector: 'app-game-layout',
  imports: [
    RouterOutlet,
    RankingComponent,
    ListErrorsComponent,
    ChronoFormatPipe,
    ModalComponent,
    NgClass,
    TranslateModule,
    JlptSelectorComponent,
    ChronoTrainingSelectorComponent,
    ChronoTrainingLayoutComponent
],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.css',
})
export class GameLayoutComponent {
  gameName: string = '';
  gameDesc: string = '';
  gameMode: GameMode | null = null;
  authService: AuthService = inject(AuthService);
  gameService: GameService = inject(GameService);

  private _time: number | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly chronoService: ChronoService,
    private readonly jlptStorage: JlptStorageService
  ) {
    this.gameService.openModale$.subscribe(() => {
      this.openModal();
    });
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  currentJlpt: JlptGrade = JlptGrade.N1;
  KANJI_COUNT: Record<number, number> = {
    5: 80,
    4: 250,
    3: 620,
    2: 1000,
    1: 2134,
  };
  private static readonly JLPT_GRADE_LS_NAME = 'jlptGrade';

  ngOnInit(): void {
    // Récupère le niveau sauvegardé au chargement (si disponible)
    const stored = this.jlptStorage.jlptGrade;
    if (stored) {
      this.currentJlpt = stored;
    } else {
      this.jlptStorage.jlptGrade = this.currentJlpt;
    }

    this.gameService.newCard$.subscribe(() => {
      // Une nouvelle carte vient d'arriver : prévoir un scroll
      this.needScroll = true;
    });

    // 1. Au chargement initial (F5)
    this.setTitleFromRoute(this.route);

    // 2. Lors des navigations internes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitleFromRoute(this.route);
      });
    this.gameService.resetGame();
  }

  onChangeJlpt(selected: JlptGrade) {
    this.currentJlpt = selected;
    this.jlptStorage.jlptGrade = selected;
    // on demande un reload du ranking
    this.gameService.refreshRanking$.next();
    console.log('ici')
    this.gameService.resetGame();
    this.gameService.resetPostGameDatas();
  }

  // on scroll auto pour s'assurer que les choices sont toujours visibles
  @ViewChild('endChoices') endChoices!: ElementRef<HTMLDivElement>;
  needScroll = false;

  // Appelle ceci après chaque nouvelle carte
  triggerScrollToEndChoices() {
    this.needScroll = true;
  }

  ngAfterViewChecked() {
    if (this.needScroll) {
      this.endChoices?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      this.needScroll = false;
    }
  }

  private setTitleFromRoute(route: ActivatedRoute) {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const data = child.snapshot.data;
    this.gameName = data?.['gameName'] || '';
    this.gameDesc = data?.['gameDesc'] || '';
    this.gameMode = data?.['gameMode'] ?? null;
  }

  onStart() {
    this.gameService.StopAndStartGame();
  }

  feedbackClass() {
    return this.gameService.feedbackClass();
  }

  get card(): Card | null {
    return this.gameService.card();
  }

  get userLiveChrono() {
    return this.gameService.userLiveChrono();
  }

  get counters() {
    return this.gameService.counters();
  }

  get isLoading(): boolean {
    return this.gameService.isLoading;
  }

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.gameService.resetGame();
  }
}
