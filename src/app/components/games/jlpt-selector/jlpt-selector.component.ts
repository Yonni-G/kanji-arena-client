import { Component, Output, EventEmitter, Input } from '@angular/core';
import { JlptGrade } from '../../../models/JlptGrade';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jlpt-selector',
  templateUrl: './jlpt-selector.component.html',
  styleUrls: ['./jlpt-selector.component.css'],
  imports: [FormsModule],
})
export class JlptSelectorComponent {
  @Input() value: JlptGrade = JlptGrade.N5;
  @Output() select = new EventEmitter<JlptGrade>();

  KANJI_COUNT: Record<number, number> = {
    5: 80,
    4: 250,
    3: 620,
    2: 1000,
    1: 2134,
  };

  // Génère automatiquement tous les niveaux JLPT à partir de l’enum, dans l'ordre N5 -> N1
  readonly niveaux = Object.values(JlptGrade)
    .filter((v) => typeof v === 'number')
    .sort((a, b) => Number(b) - Number(a)) as JlptGrade[];
}
