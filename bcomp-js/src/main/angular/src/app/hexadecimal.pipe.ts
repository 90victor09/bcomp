import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexadecimal'
})
export class HexadecimalPipe implements PipeTransform {
  static chars: string[] = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

  transform(value: number, width: number): string {
    let str : string = "";
    for(let i = 0; i < width*4; i += 4)
      str = HexadecimalPipe.chars[((value >> i) & 0xF)] + str;
    return str;
  }

}
