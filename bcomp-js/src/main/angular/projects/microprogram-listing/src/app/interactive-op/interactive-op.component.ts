import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-interactive-op',
  templateUrl: './interactive-op.component.html',
  styleUrls: ['./interactive-op.component.scss']
})
export class InteractiveOpComponent implements OnChanges {
  Number = Number;
  @Input() op: string;
  @Output() jump = new EventEmitter<{lbl: boolean, val: string | number}>();

  public isGOTO: boolean = false;

  public opBegining: string = null;
  public label: string = null;
  public addr: string = null;

  private gotoRegExp = new RegExp('GOTO (([A-z0-9]+) @)? ([0-9A-F]+)$');
  ngOnChanges(changes: SimpleChanges): void {
    if(!(this.isGOTO = this.gotoRegExp.test(this.op)))
      return this.opBegining = this.label = this.addr = null;

    let matches = this.gotoRegExp.exec(this.op);

    this.opBegining = this.op.substring(0, this.op.indexOf(matches[1]));
    this.label = matches[2];
    this.addr = matches[3];
  }

  jumpToLabel(to: string) : void {
    this.jump.emit({lbl: true, val: to});
  }

  jumpToAddr(to: number) : void {
    this.jump.emit({lbl: false, val: to});
  }
}
