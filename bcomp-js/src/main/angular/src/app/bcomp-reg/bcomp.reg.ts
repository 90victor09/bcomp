import {Component, Input} from '@angular/core';

@Component({
  selector: 'bcomp-reg',
  templateUrl: './bcomp.reg.html',
  styleUrls: ['./bcomp.reg.scss']
})
export class BCompReg {
  @Input() name : string;
  @Input() width : number = 16;
  @Input() value : number = 0; //Possible overflow when > 53bit
  @Input() groupBy : number = 4;
  @Input() hex : boolean = false;
  @Input() left : boolean = true;

  constructor(){ }
}
