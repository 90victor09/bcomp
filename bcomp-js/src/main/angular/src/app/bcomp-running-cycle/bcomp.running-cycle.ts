import {Component} from '@angular/core';
import {BCompService} from "../bcomp.service";
import {cycle, state} from "../../bcomp";

@Component({
  selector: 'bcomp-running-cycle',
  templateUrl: './bcomp.running-cycle.html',
  styleUrls: ['./bcomp.running-cycle.scss']
})
export class BCompRunningCycle {
  private cycle = cycle;

  constructor(private bcompService: BCompService){}

  isActive(cycle: string | string[]) : boolean {
    if(typeof cycle == "string")
      return this.bcompService.runningCycle == cycle;

    for(let c of cycle)
      if(this.isActive(c))
        return true;

    return false;
  }

  isProgramActive() : boolean {
    return this.bcompService.getProgramState(state.PROG);
  }
}
