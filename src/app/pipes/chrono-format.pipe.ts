import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chronoFormat',
})
export class ChronoFormatPipe implements PipeTransform {
  transform(timeInSeconds: number): string {
    if (isNaN(timeInSeconds)) return '00:00.00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hundredths = Math.round(
      (timeInSeconds - Math.floor(timeInSeconds)) * 100
    );

    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    const c = hundredths.toString().padStart(2, '0');

    return `${m}:${s}.${c}`;
  }
}
