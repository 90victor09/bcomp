import { Injectable, NgZone } from '@angular/core';
import bcomp, { reg, cs } from "../bcomp"
import { BCompAngular } from "../bcomp"
import { values } from "../common";

@Injectable({
  providedIn: 'root'
})
export class BCompService {
  private bcompAngular : BCompAngular;
  public regsValues : object = {};
  public runningCycle : bcomp.runningCycles;
  public memoryView : number[] = [];
  public memoryViewOffset : number = 0;

  private tickStartListeners = [];
  private tickFinishListeners = [];

  private clockState = false;

  constructor(private ngZone: NgZone){
    for(let reg of values(bcomp.regs))
      this.regsValues[reg] = 0;
    for(let i = 0; i < 16; i++)
      this.memoryView.push(0);

    this.bcompAngular = bcomp.startAngular(() => this.updateRegs());

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

    this.bcompAngular.setTickStartListener(() => {
      this.updateRunningCycle();
      for(let key in this.tickStartListeners)
        this.tickStartListeners[key]();
    });
    this.bcompAngular.setTickFinishListener(() => {
      this.bcompAngular.getRegValue(reg.IR, (val) => this.regsValues[reg.IR] = Number("0x" + val));
      bcomp.sleep(0); // Context switching injection
      for(let key in this.tickFinishListeners)
        this.tickFinishListeners[key]();
    });
  }

  public sync(cb: () => void) : void {
    this.bcompAngular.sync(cb);
  }


  public startContinue() : void {
    this.bcompAngular.startContinue();
  }
  public startSetAddr() : void {
    this.bcompAngular.startSetAddr();
  }
  public startWrite() : void {
    this.bcompAngular.startWrite();
  }
  public startRead() : void {
    this.bcompAngular.startRead();
  }
  public startStart() : void {
    this.bcompAngular.startStart();
  }


  public executeContinue(cb?: () => void) : void {
    if(!cb)
      cb = () => {};
    this.bcompAngular.executeContinue(cb);
  }


  public setMemoryValue(addr: number, value: number) : void {
    this.bcompAngular.setMemoryValue(addr, value);
  }
  public setRegValue(reg: bcomp.regs, value: number) : void {
    this.bcompAngular.setRegValue(reg, value);
  }
  public getRegValue(reg: bcomp.regs, cb: (val: number) => void) : void {
    this.bcompAngular.getRegValue(reg, (value: number) => {
      cb(value);
    });
  }

  public getProgramState(state: bcomp.states) : boolean {
    return ((this.regsValues[reg.PS] >> state) & 1) > 0;
  }


  private addRegUpdateSignals(reg: bcomp.regs, ...signals: bcomp.controlSignals[]) : void {
    for(let sig of signals)
      this.bcompAngular.addSignalListener(sig, () => this.updateReg(reg));
  }

  public addSignalsListener(sigs: bcomp.controlSignals[], cb: (val) => void) : void {
    for(let sig of sigs)
      this.bcompAngular.addSignalListener(sig, cb);
  }

  public addTickStartListener(cb: () => any){
    this.tickStartListeners.push(cb);
  }
  public addTickFinishListener(cb: () => any){
    this.tickFinishListeners.push(cb);
  }

  public invertClockState() : boolean {
    this.bcompAngular.setClockState(this.clockState);
    return this.clockState = !this.clockState;
  }
  public invertRunState() : boolean {
    const bit = (1 << bcomp.states.RUN);
    // console.log(bit.toString(2), (~bit).toString(2));
    let state = !(((this.regsValues[reg.PS] >> bcomp.states.RUN) & 1) > 0);
    if(state){
      this.setRegValue(reg.PS, (this.regsValues[reg.PS] + bit));
    }else{
      this.setRegValue(reg.PS, (this.regsValues[reg.PS] - bit));
    }
    this.updateReg(reg.PS);
    return state;
  }



  public updateRegs() : void {
    for(let reg of values(bcomp.regs))
      this.updateReg(Number(reg));
  }
  public updateReg(regIdx: bcomp.regs) : void {
    this.getRegValue(regIdx, (val) => {
      // if(val != 0)
      //   console.log(reg[regIdx]," ", val,"(upd)");

      // Weird change detection mechanism
      this.regsValues[regIdx] = val;
      this.ngZone.run(() => this.regsValues[regIdx] = val);
    });
  }

  public updateRunningCycle() : void {
    this.bcompAngular.getRunningCycle((c) => {
      this.ngZone.run(() => this.runningCycle = c);
    });
  }

  private updateMemory() : void {
    for(let i = 0; i < this.memoryView.length; i++){
      this.bcompAngular.getMemoryValue(this.memoryViewOffset + i, (val) => {
        this.ngZone.run(() => this.memoryView[i] = Number("0x" + val))
      });
    }
  }



  private static getPage(addr: number) : number {
    return addr & (~0xF);
  }
}
