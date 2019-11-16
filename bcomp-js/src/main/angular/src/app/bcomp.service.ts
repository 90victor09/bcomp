import {Injectable, NgZone} from '@angular/core';
import bcomp, { reg, cycle, cs } from "../bcomp"
import { BCompAngular } from "../bcomp"

declare var window;
@Injectable({
  providedIn: 'root'
})
export class BCompService {
  private bcompAngular : BCompAngular;
  public regsValues : object = {};
  public runningCycle : string;
  public memoryView : number[] = [];
  public memoryViewOffset : number = 0;

  constructor(private ngZone: NgZone){
    window.updateRegs = () => this.updateRegs();
    window.updateMemory = () => this.updateMemory();
    for(let reg of bcomp.regs)
      this.regsValues[reg] = 0;
    for(let i = 0; i < 16; i++)
      this.memoryView.push(0);

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

    this.addSignalsListener([cs.STOR, cs.LOAD], () => {
      this.bcompAngular.getLastAccessedMemoryAddress((addr) => {
        this.memoryViewOffset = BCompService.getPage(addr);
        this.ngZone.run(() => this.updateMemory());
      })
    });

    bcompAngular.setTickStartListener(() => {
      this.updateRunningCycle();
    });
    bcompAngular.setTickFinishListener(() => {
      this.bcompAngular.getRegValue(reg.IR, (val) => this.regsValues[reg.IR] = Number("0x" + val));
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

  private addSignalsListener(sigs: string[], cb: (val) => void){
    for(let sig of sigs)
      this.bcompAngular.addSignalListener(sig, cb);
  }

  private static getPage(addr: number) : number {
    return addr & (~0xF);
  }
  private updateMemory() : void {
    for(let i = 0; i < this.memoryView.length; i++){
      this.bcompAngular.getMemoryValue(this.memoryViewOffset + i, (val) => {
        this.ngZone.run(() => this.memoryView[i] = Number("0x" + val))
      });
    }
  }

  public updateRunningCycle() : void {
    this.bcompAngular.getRunningCycle((c) => {
      this.ngZone.run(() => this.runningCycle = c);
    });
  }

  public getProgramState(state: string) : boolean {
    return ((this.regsValues[reg.PS] >> bcomp.states.indexOf(state)) & 1) > 0;
  }

}
