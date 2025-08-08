import { Component } from '@angular/core';
import { PracticeModeService } from '../../../services/practice-mode.service';
import { ChronometerComponent } from '../chronometer-mode/chronometer-mode.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chrono-training-layout',
  imports: [ChronometerComponent, TranslateModule],
  templateUrl: './chrono-training-layout.component.html',
  styleUrls: ['./chrono-training-layout.component.css']
})
export class ChronoTrainingLayoutComponent {
  mode: 'chrono' | 'training' = 'chrono';

  constructor(private readonly practiceModeService: PracticeModeService) {
    this.practiceModeService.mode$.subscribe((mode) => (this.mode = mode));
  }
}
