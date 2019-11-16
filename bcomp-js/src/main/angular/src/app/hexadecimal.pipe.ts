import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexadecimal'
})
export class HexadecimalPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null; //TODO
  }

}
