import { AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import bcomp, { BCompAngular, state, reg } from "../../../../src/bcomp";
import { hex, setBit, toHex, values } from "../../../../src/common";

export abstract class BCompTracer implements AfterViewChecked {
  reg = reg;
  iNZVC = 14;
  iMEM = 15;
  iMPbefore = 16;

  checks = {};
  answers = {};

  learningMode : boolean = true;
  tryCount : number = 0;
  timer : number;
  time : number = 0;

  errorMessage : string = null;

  protected readonly bcomp : BCompAngular;
  protected constructor() {
    this.bcomp = bcomp.startAngular(() => {});
    this.timer = setInterval(() => this.time++, 1000);
  }


  /*
    Inputs cache
   */
  @ViewChild("linesContainer", {static: true}) linesContainerRef: ElementRef;
  protected shouldUpdateInputs: boolean = false;
  protected inputs: HTMLInputElement[] = [];
  ngAfterViewChecked(): void {
    if(!this.shouldUpdateInputs)
      return;
    this.shouldUpdateInputs = false;

    this.inputs = Array.from<HTMLInputElement>(this.linesContainerRef.nativeElement.querySelectorAll("tr:not(.not-executable) input:not([readOnly])"));
  }

  /*
    Variant fetch
   */
  abstract fetchTask(variantStr: string | number);

  /*
    BComp
   */
  abstract setupBComp() : void;
  abstract getTotalLines() : number;
  abstract getExecutionStartLine() : number;

  gotoLine(lineNo: number) : void {
    this.setupBComp();
    for(let i = 0; i < lineNo - this.getExecutionStartLine() + 1; i++)
      this.bcomp.executeContinue(() => {});
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

  /*
    Checks
   */
  abstract checkLine(lineNo: number, inputs: HTMLInputElement[]);
  checkReg(lineNo: number, r: bcomp.regs, val: string) : void {
    this.bcomp.getRegValue(r, (regVal: number) => {
      this.checks[lineNo] = setBit(this.checks[lineNo], r, regVal == Number("0x" + val));
    });
  }
  checkNZVC(lineNo: number, val: string) : void {
    this.formNZVC((nzvcVal: string) => {
      this.checks[lineNo] = setBit(this.checks[lineNo], this.iNZVC, Number("0b" + nzvcVal) == Number("0b" + val))
    });
  }
  checkAll() : void {
    let executableTotal = 0;
    for(let i = 0; i < this.getTotalLines(); i++) {
      if(!this.isExecutable(i) || this.answers[i])
        continue;
      executableTotal++;
    }

    let nFields = this.inputs.length/executableTotal;
    let j = 0;

    for(let i = 0; i < this.getTotalLines(); i++){
      if(!this.isExecutable(i) || this.answers[i])
        continue;
      this.checkLine(i, this.inputs.slice(j*nFields, j*nFields + nFields));
      j++;
    }
    this.tryCount = Math.floor(this.tryCount);
  }

  /*
    Answers
   */
  abstract showAnswer(lineNo: number) : void;
  showRegAnswer(lineNo: number, r: bcomp.regs, ind?: number) : void {
    this.bcomp.getRegValue(r, (regVal: number) => {
      let width = 4;
      if(r == reg.IP || r == reg.AR || r == reg.SP)
        width = 3;
      if(r == reg.MP)
        width = 2;
      this.answers[lineNo][ind != null ? ind : r] = toHex(regVal, width);
    });
  }


  /*
    Boolean data
   */

  isExecutable(i: number) : boolean {
    return this.getExecutionStartLine() <= i;
  }
  isValid(lineNo: number, regIdx: number) : boolean {
    return ((this.checks[lineNo] == undefined || this.answers[lineNo] != undefined) ? null : ((this.checks[lineNo] >> regIdx) & 1) > 0);
  }


  /*
    String data
   */

  getFormattedTime() : string {
    let hours = Math.floor(this.time / 3600);
    let minutes = Math.floor((this.time - hours*3600) / 60);
    let seconds = this.time  - hours*3600 - minutes*60;
    return hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  getAnswer(i: number, regIdx: number){
    return this.answers[i] && this.answers[i][regIdx] || '';
  }
  getTotal() : number {
    let c = 0;
    for(let i = 0; i < this.getTotalLines(); i++){
      if(!this.isExecutable(i) || this.answers[i])
        continue;
      c += 8;
    }
    return c;
  }
  getDoneRight() : number {
    let c = 0;
    for(let i = 0; i < this.getTotalLines(); i++){
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


  /*
    Focus manager
   */
  changeFocus(e: KeyboardEvent){
    let input = <HTMLInputElement>e.target;
    if(input.selectionStart != input.selectionEnd || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)
      return;

    let idx = this.inputs.indexOf(input);

    // *Char*, Enter, ArrowRight
    if(e.key.length == 1 || e.key == "Enter" || e.key == "ArrowRight" || e.key == "Right"){
      // At the end of input && has next input
      if(input.selectionEnd != (e.key.length != 1 ? input.value.length : input.maxLength) || ++idx == this.inputs.length)
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

      if(idx >= this.inputs.length)
        return;
    }else // None
      return;

    let pos = input.selectionEnd;
    this.inputs[idx].focus();

    if(e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Up" || e.key == "Down")
      this.inputs[idx].selectionEnd = this.inputs[idx].selectionStart = Math.min(pos, this.inputs[idx].maxLength);

    // Prevent arrows (and enter) after focus
    if(e.key.length != 1 && e.key != "Backspace")
      e.preventDefault();
  }
}
