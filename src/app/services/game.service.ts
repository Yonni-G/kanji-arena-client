// game.service.ts
import { inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiGameService } from './api.game.service';
import { Card } from '../models/Card';
import { ChronoService } from './chrono.service';
import { GameMode } from '../models/GameMode';
import { UserChrono } from '../models/userChrono';
import { CardError } from '../models/CardError';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiGameService: ApiGameService = inject(ApiGameService);

  /* TODO : voir pour faire mieux pour gérer la dependance circulaire */
  private readonly injector = inject(Injector); // ✅ bonne syntaxe ici
  private _chronoService!: ChronoService;
  private get chronoService(): ChronoService {
    if (!this._chronoService) {
      this._chronoService = this.injector.get(ChronoService);
    }
    return this._chronoService;
  }

  // Subject pour l'état du chronometre
  private readonly startSubject = new Subject<void>();
  private readonly stopSubject = new Subject<void>();
  private readonly resetSubject = new Subject<void>();

  // Subject pour l'affichage du classement
  refreshRanking$ = new Subject<void>();
  // Subject pour l'affichage de la modale
  openModale$ = new Subject<void>();

  private _counters = {
    success: 0,
    errors: 0,
    total: 0,
  };
  private _gameMode: GameMode = GameMode.CLASSIC;
  private _gameToken: string | null = null;
  private _card: Card | null = null;
  private _listErrors: CardError[] = [];
  listErrors: CardError[] = [];

  private _userLiveChrono: UserChrono | null = null;
  private _feedbackClass: string = ''; // Classe dynamique pour feedback

  // PUBLIC
  // on expose nos observables.
  start$ = this.startSubject.asObservable();
  stop$ = this.stopSubject.asObservable();
  reset$ = this.resetSubject.asObservable();
  // --
  isLoading: boolean = false;
  loadingCheckState: string = 'disabled';

  initGame(gameMode: GameMode) {
    this._gameMode = gameMode;
    // on masque le chrono actuel
    this._userLiveChrono = null;
  }

  onCheck(choiceIndex: number, card: Card) {
    this.loadingCheckState = 'enabled';

    // Étape 1 : on commence par activer le loading
    setTimeout(() => {
      this.apiGameService
        .checkAnswer(this._gameMode, this._gameToken!, choiceIndex)
        .subscribe({
          next: (response) => {
            
            this._counters.total++;
            
            // FIN DE PARTIE ?
            if (response.chronoValue) {

              this._userLiveChrono = response;
              // TODO : voir pour ne pas rafraichir le classement systematiquement
              this.refreshRanking$.next();

              // on arrete le chrono
              this.stopSubject.next();
              this.loadingCheckState = 'disabled';
              // on affiche les erreurs
              this.listErrors = this._listErrors;
              // ON AFFICHE la modale
              this.openModale$.next();
              
              return;
            }

            this._gameToken = response.gameToken;

            if (response.correct) {
              this._counters.success++;
              this._feedbackClass = 'correctAnswer';
            } else {
              this._counters.errors++;
              this._feedbackClass = 'unCorrectAnswer';

              // on collecte les erreurs
              this._listErrors.push({
                proposal: card?.proposal,
                correct: card?.choices[response.correctIndex].label,
                unCorrect: card?.choices[choiceIndex].label,
              });
              console.log(this._listErrors);
            }
            
            this.loadingCheckState = 'masquer les boutons';
            // Étape 2 : laisser apparaître la couleur de feedback
            setTimeout(() => {
              this.isLoading = false;
              this._card = response.card; // nouvelle carte
              this._feedbackClass = ''; // reset couleur
              this.loadingCheckState = 'disabled';
            }, 400); // délai feedback visible (ajustable)
          },
          error: (err) => {
            console.error('Erreur lors du contrôle de la réponse', err);
            this.isLoading = false;
          },
        });

      
    }, 200); // petite latence avant la requête (pour bien voir le spinner si besoin)
  }

  // fonction qui va réinitialiser les données d'affichage post-partie
  resetPostGameDatas() {
    // on masque le dernier chrono
    this._userLiveChrono = null;
    // on reinit les tableaux d'erreurs
    this._listErrors = [];
    this.listErrors = [];
  }

  StopAndStartGame() {
    // Si le jeu est déjà lancé => on reset
    if (this._card) {
      this.resetGame();
      return;
    }

    this.resetPostGameDatas();

    // on démarre le jeu et en retour on obtient une carte
    this.isLoading = true;
    
    this.startGame(this._gameMode, () => {
      this.isLoading = false;
      this.startSubject.next(); // Démarrer le chrono
    });
  }

  // chargement de cartes avec callback loading optionnel
  startGame(gameMode: GameMode, onLoaded?: () => void) {
    this.apiGameService.startGame(gameMode).subscribe({
      next: (response) => {
        this._card = response.card;
        this._gameToken = response.gameToken;
        //console.log(this._gameToken);
        if (onLoaded) onLoaded();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cartes classiques:', err);
      },
    });
  }

  resetGame() {
    // on arrete le chrono
    this.resetSubject.next();

    // on réinitialise les données du jeu
    this._card = null;
    
    this._counters = {
      success: 0,
      errors: 0,
      total: 0,
    };
  }

  // accesseurs d'affichage
  counters() {
    return this._counters;
  }

  card(): Card | null {
    return this._card || null;
  }

  userLiveChrono(): UserChrono | null {
    return this._userLiveChrono;
  }

  feedbackClass() {
    return this._feedbackClass;
  }
}
