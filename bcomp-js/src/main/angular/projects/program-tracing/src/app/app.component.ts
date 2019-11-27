import { Component } from '@angular/core';
import bcomp, { BCompAngular, reg, state } from "../../../../src/bcomp";
import { hex, setBit, toHex, values } from "../../../../src/common";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  reg = reg;
  taskVariant : {variant: number, startWith: string, cmds: string[][], executableLines: number} = {
    variant: 0,
    startWith: "001",
    cmds: [
      ["000", "NOP", "0000"]
    ],
    executableLines: 0
  };
  learningMode : boolean = true;
  tryCount : number = 0;
  timer : number;
  time : number = 0;

  iNZVC = reg.PS;

  checks = {};
  answers = {};

  private readonly bcomp : BCompAngular;
  constructor() {
    this.bcomp = bcomp.startAngular(() => {});
    this.timer = setInterval(() => this.time++, 1000);
    this.fetchTask(1234); //TODO remove
  }


  setupBComp() : void {
    for(let r of values(bcomp.regs))
      this.bcomp.setRegValue(Number(r), Number(r) == reg.MP ? 1 : 0); // 00 - HALT

    for(let i = 0; i < this.taskVariant.cmds.length; i++)
      this.bcomp.setMemoryValue(hex(this.taskVariant.cmds[i][0]), hex(this.taskVariant.cmds[i][2]));

    this.bcomp.setRegValue(reg.IP, hex(this.taskVariant.startWith));
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

  fetchTask(variantStr: string | number){
    let variant = Number(variantStr);
    if(isNaN(variant))
      return;

    let response : any = {
      variant: 1234,
      startWith: "004",
      cmds: [
        ["001", "0000",     "0000"],
        ["002", "0000",     "0000"],
        ["003", "4F22",     "4F22"],
        ["004", "+ADD 003", "4003"],
        ["005", "HLT",      "0100"]
      ]
    }; //TODO HTTP request

    this.taskVariant = {
      variant: variant,
      startWith: response.startWith,
      cmds: response.cmds,
      executableLines: 0
    };

    for(let i = 0; i < this.taskVariant.cmds.length; i++)
      if(this.isExecutable(i))
        this.taskVariant.executableLines += 1;

    this.tryCount = 0;
    this.time = 0;
  }


  checkLine(lineNo : number, IP, CR, AR, DR, SP, BR, AC, NZVC) : void {
    this.gotoLine(lineNo);

    this.checks[lineNo] = this.checks[lineNo] || 0;
    this.checkReg(lineNo, reg.IP, IP.value);
    this.checkReg(lineNo, reg.CR, CR.value);
    this.checkReg(lineNo, reg.AR, AR.value);
    this.checkReg(lineNo, reg.DR, DR.value);
    this.checkReg(lineNo, reg.SP, SP.value);
    this.checkReg(lineNo, reg.BR, BR.value);
    this.checkReg(lineNo, reg.AC, AC.value);

    this.formNZVC((val) => this.checks[lineNo] = setBit(this.checks[lineNo], this.iNZVC, val == NZVC.value));
    this.tryCount += 1/this.taskVariant.executableLines;
  }
  checkReg(lineNo: number, r: bcomp.regs, val: string) : void {
    this.getRegHexValue(r, (hexVal) => {
      this.checks[lineNo] = setBit(this.checks[lineNo], r, hexVal == val.toUpperCase());
    });
  }
  checkAll(lines: HTMLCollection) : void {
    for(let i = 0; i < lines.length; i++){
      if(!this.isExecutable(i))
        continue;

      function byTitle(name: string) : HTMLInputElement { //LOL
        return <HTMLInputElement>lines[i].querySelector("input[title='" + name + "']");
      }
      this.checkLine(i,
        byTitle("IP"),
        byTitle("CR"),
        byTitle("AR"),
        byTitle("DR"),
        byTitle("SP"),
        byTitle("BR"),
        byTitle("AC"),
        byTitle("NZVC"));
    }
    this.tryCount = Math.floor(this.tryCount);
  }


  showAnswer(lineNo: number) : void {
    this.gotoLine(lineNo);

    this.answers[lineNo] = this.answers[lineNo] || [];

    this.showRegAnswer(lineNo, reg.IP);
    this.showRegAnswer(lineNo, reg.CR);
    this.showRegAnswer(lineNo, reg.AR);
    this.showRegAnswer(lineNo, reg.DR);
    this.showRegAnswer(lineNo, reg.SP);
    this.showRegAnswer(lineNo, reg.BR);
    this.showRegAnswer(lineNo, reg.AC);

    this.formNZVC((val) => this.answers[lineNo][this.iNZVC] = val);
  }
  showRegAnswer(lineNo: number, r: bcomp.regs) : void {
    this.getRegHexValue(r, (hexVal) => {
      this.answers[lineNo][r] = hexVal;
    });
  }


  getRegHexValue(r: bcomp.regs, cb: (hexVal) => void) : void {
    let width = 4;
    if(r == reg.IP || r == reg.AR || r == reg.SP)
      width = 3;

    this.bcomp.getRegValue(r, (regVal) => cb(toHex(regVal, width)));
  }

  getProgramState(psval: number, state: bcomp.states) : boolean {
    return ((psval >> state) & 1) > 0;
  }

  formNZVC(cb: (val: string) => void) : void {
    this.bcomp.getRegValue(reg.PS, (value) => {
      cb((this.getProgramState(value, state.N) ? "1" : "0")
        + (this.getProgramState(value, state.Z) ? "1" : "0")
        + (this.getProgramState(value, state.V) ? "1" : "0")
        + (this.getProgramState(value, state.C) ? "1" : "0"));
    });
  }


  get countAll() : number {
    if(!this.taskVariant)
      return 0;

    let c = 0;
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(!this.isExecutable(i) || this.answers[i])
        continue;
      c += 8;
    }
    return c;
  }
  get doneRight() : number {
    if(!this.taskVariant)
      return 0;

    let c = 0;
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(!this.isExecutable(i) || this.answers[i] || !this.checks[i])
        continue;

      let j = 0;
      while((this.checks[i] >> j) > 0){
        c += ((this.checks[i] >> j) & 1);
        j++;
      }
    }
    return c;
  }

  get formattedTime() : string {
    let hours = Math.floor(this.time / 3600);
    let minutes = Math.floor((this.time - hours*3600) / 60);
    let seconds = this.time  - hours*3600 - minutes*60;
    return hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }


  isExecutable(i: number) : boolean {
    return hex(this.taskVariant.startWith) <= hex(this.taskVariant.cmds[i][0]) && !this.answers[i];
  }
  isValid(lineNo: number, regIdx: number) : boolean {
    return (!this.checks[lineNo] ? false : ((this.checks[lineNo] >> regIdx) & 1) > 0);
  }

  genRegClass(lineNo: number, regIdx: number) : string {
    if(this.checks[lineNo] == undefined || this.answers[lineNo] != undefined)
      return "";

    return this.isValid(lineNo, regIdx) ? "valid" : "invalid";
  }

  getAnswer(i: number, regIdx: number){
    return this.answers[i] && this.answers[i][regIdx] || '';
  }

  changeFocus(e: KeyboardEvent, linesContainer: HTMLElement){
    let input = <HTMLInputElement>e.target;
    if(input.selectionStart != input.selectionEnd || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)
      return;

    let inputs = Array.from(linesContainer.getElementsByTagName("input"));
    let idx = inputs.indexOf(input);

    // *Char*, Enter, ArrowRight
    if(e.key.length == 1 || e.key == "Enter" || e.key == "ArrowRight" || e.key == "Right"){
      // At the end of input && has next input
      if(input.selectionEnd != (e.key.length != 1 ? input.value.length : input.maxLength) || ++idx == inputs.length)
        return;
    }else
    if(e.key == "Backspace" || e.key == "ArrowLeft" || e.key == "Left"){
      // At the start && has previous input
      if(input.selectionStart != 0 || --idx == -1)
        return;
    }else
    if(e.key == "ArrowUp" || e.key == "Up") {
      idx -= 8;

      if(idx < 0)
        return;
    }else
    if(e.key == "ArrowDown" || e.key == "Down"){
      idx += 8;

      if(idx > inputs.length)
        return;
    }else // None
      return;

    let pos = input.selectionEnd;
    inputs[idx].focus();

    if(e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Up" || e.key == "Down")
      inputs[idx].selectionEnd = inputs[idx].selectionStart = Math.min(pos, inputs[idx].maxLength);

    // Prevent arrows (and enter) after focus
    if(e.key.length != 1 && e.key != "Backspace")
      e.preventDefault();
  }
}
