import { Component } from '@angular/core';
import { BCompService } from "../../../../../src/app/bcomp.service";
import bcomp, { cycle, state } from "../../../../../src/bcomp";
import { values } from "../../../../../src/common";

@Component({
  selector: 'bcomp-control-unit',
  templateUrl: './bcomp.control-unit.html',
  styleUrls: ['./bcomp.control-unit.scss']
})
export class BcompControlUnit {
  cycle = cycle;

  constructor(private bcompService: BCompService){}

  isActive(cycle: bcomp.runningCycles | bcomp.runningCycles[]) : boolean {
    if(!Array.isArray(cycle))
      return this.bcompService.runningCycle == cycle;

    for(let c of values(bcomp.runningCycles))
      if(this.isActive(Number(c)))
        return true;

    return false;
  }

  isProgramActive() : boolean {
    return this.bcompService.getProgramState(state.PROG);
  }
}
