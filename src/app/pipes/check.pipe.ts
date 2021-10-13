import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'check',
})
export class CheckPipe implements PipeTransform {
  public transform(value: boolean | null | undefined): string {
    return value ? '✅' : '❌';
  }
}
