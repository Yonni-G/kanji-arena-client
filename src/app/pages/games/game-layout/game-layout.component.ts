import { Component, inject } from '@angular/core';
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
import { ChronometerComponent } from '../../../components/games/chronometer/chronometer.component';
import { Card } from '../../../models/Card';
import { NgClass } from '@angular/common';
import { ChronoService } from '../../../services/chrono.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-layout',
  imports: [
    RouterOutlet,
    RankingComponent,
    ListErrorsComponent,
    ChronoFormatPipe,
    ModalComponent,
    ChronometerComponent,
    NgClass,
  ],
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.css',
})
export class GameLayoutComponent {
  title: string = '';
  subtitle: string = '';
  gameMode: GameMode | null = null;
  authService: AuthService = inject(AuthService);
  gameService: GameService = inject(GameService);

  private _time: number | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly chronoService: ChronoService
  ) {
    this.gameService.openModale$.subscribe(() => {
      this.openModal();
    });
    this.chronoService.time$.pipe(takeUntilDestroyed()).subscribe((time) => {
      this._time = time;
    });
  }

  ngOnInit(): void {
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

  private setTitleFromRoute(route: ActivatedRoute) {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const data = child.snapshot.data;
    this.title = data?.['title'] || '';
    this.subtitle = data?.['subtitle'] || '';
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
