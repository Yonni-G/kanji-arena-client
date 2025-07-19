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
  @Input() value: JlptGrade = JlptGrade.N1;
  @Output() select = new EventEmitter<JlptGrade>();

  // Génère automatiquement tous les niveaux JLPT à partir de l’enum, dans l'ordre N5 -> N1
  readonly niveaux = Object.values(JlptGrade)
    .filter((v) => typeof v === 'number')
    .sort((a, b) => Number(b) - Number(a)) as JlptGrade[];
}
