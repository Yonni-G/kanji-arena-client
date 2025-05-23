import { Component, inject } from '@angular/core';
import { ChronoService } from '../../../services/chrono.service';
import { ChronoFormatPipe } from '../../../pipes/chrono-format.pipe';

@Component({
  selector: 'app-chronometer',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.css'],
  imports: [ChronoFormatPipe],
})
export class ChronometerComponent {
  chronoService: ChronoService = inject(ChronoService);
  time: number | null = null;

  constructor() {
    this.chronoService.time$.subscribe((temps) => {
      this.time = temps;
    });
  }
}
