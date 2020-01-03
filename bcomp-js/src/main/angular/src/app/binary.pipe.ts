import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'binary'
})
export class BinaryPipe implements PipeTransform {

  transform(value: number, width: number = 16): string {
    let str : string = "";
    for(let i = 0; i < width; i ++)
      str = ((value >> i) & 0x1) + str;
    return str;
  }

}
