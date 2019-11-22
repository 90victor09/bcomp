import { Component } from '@angular/core';
import bcomp, { BCompAngular, reg, state } from "../../../../src/bcomp";
import { HexadecimalPipe } from "../../../../src/app/hexadecimal.pipe";

function hex(hex: string) : number {
  return Number("0x" + hex);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Number = Number;
  taskVariantNumber : number = 1234;
  taskVariant = {
    startWith: "004",
    cmds: [
      ["001", "WORD 0000","0000"],
      ["002", "WORD 0000","0000"],
      ["003", "WORD 4F22","4F22"],
      ["004", "ADD 003",  "4003"],
      ["005", "HALT",     "F200"]
    ]
  };
  learning : boolean = true;

  iIP : number = 0;
  iCR : number = 1;
  iAR : number = 2;
  iDR : number = 3;
  iSP : number = 4;
  iBR : number = 5;
  iAC : number = 6;
  iNZVC : number = 7;

  checks = {};
  answers = {};

  private readonly bcomp : BCompAngular;
  constructor() {
    this.bcomp = bcomp.startAngular(() => {});
  }

  setupBComp() : void {
    for(let r of bcomp.regs)
      this.bcomp.setRegValue(r,r == reg.MP ? 1 : 0); // 00 - HALT

    for(let i = 0; i < this.taskVariant.cmds.length; i++)
      this.bcomp.setMemoryValue(hex(this.taskVariant.cmds[i][0]), hex(this.taskVariant.cmds[i][2]));

    this.bcomp.setRegValue(reg.IP, hex(this.taskVariant.startWith))
  }
  gotoLine(lineNo: number) : void {
    this.setupBComp();

    let startWithIdx = -1;
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(this.taskVariant.cmds[i][0] == this.taskVariant.startWith){
        startWithIdx = i;
        break;
      }
    }

    for(let i = 0; i < lineNo- startWithIdx + 1; i++)
      this.bcomp.executeContinue(() => {});
  }

  checkLine(lineNo : number, IP, CR, AR, DR, SP, BR, AC, NZVC) : void {
    this.gotoLine(lineNo);

    this.checks[lineNo] = this.checks[lineNo] || 0;
    this.checkReg(lineNo, reg.IP, IP.value, this.iIP);
    this.checkReg(lineNo, reg.CR, CR.value, this.iCR);
    this.checkReg(lineNo, reg.AR, AR.value, this.iAR);
    this.checkReg(lineNo, reg.DR, DR.value, this.iDR);
    this.checkReg(lineNo, reg.SP, SP.value, this.iSP);
    this.checkReg(lineNo, reg.BR, BR.value, this.iBR);
    this.checkReg(lineNo, reg.AC, AC.value, this.iAC);

    this.bcomp.getRegValue(reg.PS, (value) => {
      let actualNZVC = (this.getProgramState(value, state.N) ? "1" : "0")
        + (this.getProgramState(value, state.Z) ? "1" : "0")
        + (this.getProgramState(value, state.V) ? "1" : "0")
        + (this.getProgramState(value, state.C) ? "1" : "0");
      this.checks[lineNo] += (actualNZVC == NZVC.value ? 1 : 0) << this.iNZVC;
    });
  }
  checkReg(lineNo: number, r: string, val: string, shift: number) : void {
    this.getRegHexValue(r, (hexVal) => {
      console.log(r, hexVal, '"'+val+'"', hexVal == val);
      let bit = (hexVal == val ? 1 : 0);
      this.checks[lineNo] = (bit != 0 ? (this.checks[lineNo] | (bit << shift)) : (this.checks[lineNo] & ~(1 << shift)));
    })
  }
  getRegHexValue(r: string, cb: (hexVal) => void) : void{
    let width = 4;
    if(r == reg.IP || r == reg.AR || r == reg.SP)
      width = 3;

    this.bcomp.getRegValue(r, (regVal) => cb(HexadecimalPipe.toHex(regVal, width)));
  }
  showAnswer(lineNo: number) : void {
    this.gotoLine(lineNo);

    this.answers[lineNo] = this.answers[lineNo] || [];

    this.showRegAnswer(lineNo, reg.IP, this.iIP);
    this.showRegAnswer(lineNo, reg.CR, this.iCR);
    this.showRegAnswer(lineNo, reg.AR, this.iAR);
    this.showRegAnswer(lineNo, reg.DR, this.iDR);
    this.showRegAnswer(lineNo, reg.SP, this.iSP);
    this.showRegAnswer(lineNo, reg.BR, this.iBR);
    this.showRegAnswer(lineNo, reg.AC, this.iAC);

    this.bcomp.getRegValue(reg.PS, (value) => {
      this.answers[lineNo][this.iNZVC] = (this.getProgramState(value, state.N) ? "1" : "0")
        + (this.getProgramState(value, state.Z) ? "1" : "0")
        + (this.getProgramState(value, state.V) ? "1" : "0")
        + (this.getProgramState(value, state.C) ? "1" : "0");
    });
  }
  showRegAnswer(lineNo: number, r: string, rInd: number) : void {
    this.getRegHexValue(r, (hexVal) => {
      this.answers[lineNo][rInd] = hexVal;
    });
  }
  checkAll(lines: HTMLCollection) : void {
    //TODO
  }

  countAll() : number {
    let c = 0;
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(!this.isExecutable(i) || this.answers[i])
        continue;
      c += 8;
    }
    return c;
  }
  countDoneRight() : number {
    let c = 0;
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(!this.isExecutable(i) || this.answers[i] || !this.checks[i])
        continue;

      let j = 0;
      while((this.checks[i] >> j) > 0){
        j++;
      }
      c += j;
    }
    return c;
  }

  getProgramState(psval: number, state: string) : boolean {
    return ((psval >> bcomp.states.indexOf(state)) & 1) > 0;
  }


  isExecutable(i: number) : boolean {
    return hex(this.taskVariant.startWith) <= hex(this.taskVariant.cmds[i][0]) && !this.answers[i];
  }
  isValid(lineNo : number, regIdx : number) : boolean {
    return (this.checks[lineNo] == undefined ? false : ((this.checks[lineNo]>>regIdx)&1) > 0);
  }

  genRegClass(lineNo : number, regIdx : number) : string {
    if(this.checks[lineNo] == undefined)
      return "";

    return this.isValid(lineNo, regIdx) ? "valid" : "invalid";
  }
}
