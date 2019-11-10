import {Component, Input} from '@angular/core';

@Component({
  selector: 'bcomp-reg',
  templateUrl: './bcomp.reg.html',
  styleUrls: ['./bcomp.reg.scss']
})
export class BCompReg {
  @Input() name : string;
  @Input() width : number;
  value : number = 1234;

  getFormattedValue() : string {
    let tmp : number = this.value;
    let str : string = "";
    for(let i = 0; i < this.width; i++)
      str = (i%4 === 3 ? " ": "") + ((tmp>>i)&1) + str;
    return str;
  }
}
