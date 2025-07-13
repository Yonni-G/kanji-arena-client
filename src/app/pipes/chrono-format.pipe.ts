import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chronoFormat',
})
export class ChronoFormatPipe implements PipeTransform {
  transform(timeInSeconds: number): string {
    if (isNaN(timeInSeconds)) return '00:00.00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    let hundredths = Math.floor(
      (timeInSeconds - Math.floor(timeInSeconds)) * 100
    );

    // Correction pour éviter le cas .100 dû à l'arrondi flottant
    if (hundredths >= 100) {
      hundredths = 99;
    }

    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    const c = hundredths.toString().padStart(2, '0');

    return `${m}:${s}.${c}`;
  }
}
