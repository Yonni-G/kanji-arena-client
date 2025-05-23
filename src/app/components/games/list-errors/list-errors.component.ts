import { Component, inject, Input } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { GameMode } from '../../../models/GameMode';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-errors',
  imports: [NgClass],
  templateUrl: './list-errors.component.html',
  styleUrl: './list-errors.component.css',
})
export class ListErrorsComponent {
  showErrors: boolean = false;
  // Ajout de GameMode pour l'utiliser dans le template HTML
  GameMode = GameMode;
  @Input() gameMode: GameMode | null = null;
  gameService: GameService = inject(GameService);

  get listErrors() {
    return this.gameService.listErrors;
  }
}
