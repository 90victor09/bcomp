import {Injectable, NgZone} from '@angular/core';
import bcomp, { reg, cs } from "../bcomp"
import { BCompAngular } from "../bcomp"

declare var window;
@Injectable({
  providedIn: 'root'
})
export class BCompService {
  private bcompAngular : BCompAngular;
  public regsValues : object = {};
  public runningCycle : string;

  constructor(private ngZone: NgZone){
    window.updateRegs = () => this.updateRegs();
    for(let reg of bcomp.regs)
      this.regsValues[reg] = 0;
    // this.bcompAngular = bcomp.startAngular(() => updateRegs())
  }

  public setBComp(bcompAngular: BCompAngular){ //TODO move to constructor
    this.bcompAngular = bcompAngular;

    this.addRegUpdateSignals(reg.AR, cs.WRAR);
    this.addRegUpdateSignals(reg.DR, cs.WRDR, cs.LOAD);
    this.addRegUpdateSignals(reg.CR, cs.WRCR);
    this.addRegUpdateSignals(reg.IP, cs.WRIP);
    this.addRegUpdateSignals(reg.AC, cs.WRAC);
    this.addRegUpdateSignals(reg.PS, cs.RDPS, cs.WRPS, cs.SETC, cs.SETV, cs.STNZ, cs.DINT, cs.EINT, cs.HALT, cs.SET_PROGRAM);
    this.addRegUpdateSignals(reg.SP, cs.WRSP);
    this.addRegUpdateSignals(reg.BR, cs.WRBR);

    bcompAngular.setTickStartListener(() => {
      this.updateRunningCycle();
    });
    bcompAngular.setTickFinishListener(() => {

    });
  }

  public updateReg(name: string) : void {
    this.bcompAngular.getRegValue(name, (val) => {
      if(Number("0x"+val) != 0)
        console.log(name," ",val,"(upd)");

      // Weird change detection mechanism
      this.ngZone.run(() => this.regsValues[name] = Number("0x" + val)); //XXX: Possible overflow while > 53 bits
    });
  }
  public updateRegs(): void {
    for(let reg of bcomp.regs)
        this.updateReg(reg);
  }

  private addRegUpdateSignals(reg: string, ...signals: string[]) : void {
    for(let sig of signals)
      this.bcompAngular.addSignalListener(sig, (val) => this.updateReg(reg));
  }

  public updateRunningCycle() : void {
    this.bcompAngular.getRunningCycle((cycle) => this.runningCycle = cycle);
  }

  public getProgramState(state: string) : boolean {
    return ((this.regsValues[reg.PS] >> bcomp.states.indexOf(state)) & 1) > 0;
  }

}
