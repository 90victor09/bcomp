import { Pipe, PipeTransform } from '@angular/core';
import { toHex } from "../../../../src/common";

@Pipe({
  name: 'hexadecimal'
})
export class HexadecimalPipe implements PipeTransform {
  transform(value: number, width: number) : string {
    return toHex(value, width);
  }

}
