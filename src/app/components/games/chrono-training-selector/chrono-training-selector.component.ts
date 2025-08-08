import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PracticeModeService } from '../../../services/practice-mode.service';
import { GameService } from '../../../services/game.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chrono-training-selector',
  imports: [MatButtonToggleModule, FormsModule, TranslateModule],
  templateUrl: './chrono-training-selector.component.html',
  styleUrls: ['./chrono-training-selector.component.css'],
})
export class ChronoTrainingSelectorComponent implements OnInit {
  mode!: 'chrono' | 'training';

  constructor(private readonly practiceModeService: PracticeModeService, private readonly gameService: GameService) {}

  ngOnInit() {
    // Initie le service avec le mode par défaut
    // Récupère d’abord la valeur du service au démarrage
    this.practiceModeService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  onModeChange(mode: 'chrono' | 'training') {
    this.mode = mode;
    this.practiceModeService.setMode(mode);
    // on réinitialise le jeu
    this.gameService.resetGame();
  }
}
// chrono-training-selector.component.ts