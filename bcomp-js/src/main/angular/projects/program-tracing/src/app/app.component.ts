import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import bcomp, { reg } from "../../../../src/bcomp";
import { hex, values } from "../../../../src/common";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { BCompTracer } from "./bcomp-tracer.class";


interface Task {
  variant: number,
  startWith: string,
  cmds: string[][]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BCompTracer implements AfterViewChecked {
  // reg = reg;
  taskVariant : {variant: number, startWith: string, cmds: string[][], executableLines: number} = {
    variant: 0,
    startWith: "001",
    cmds: [
      ["000", "NOP", "0000"]
    ],
    executableLines: 0
  };
  constructor(private http: HttpClient, cdRef: ChangeDetectorRef) {
    super(cdRef);
  }

  getExecutionStartLine(): number {
    for(let i = 0; i < this.taskVariant.cmds.length; i++){
      if(this.taskVariant.cmds[i][0] == this.taskVariant.startWith)
        return i;
    }
  }

  getTotalLines(): number {
    return this.taskVariant.cmds.length;
  }

  setupBComp() : void {
    for(let r of values(bcomp.regs))
      this.bcomp.setRegValue(Number(r), Number(r) == reg.MP ? 1 : 0); // 00 - HALT

    for(let i = 0; i < this.taskVariant.cmds.length; i++)
      this.bcomp.setMemoryValue(hex(this.taskVariant.cmds[i][0]), hex(this.taskVariant.cmds[i][2]));

    this.bcomp.setRegValue(reg.IP, hex(this.taskVariant.startWith));
  }

  fetchTask(variantStr: string | number){
    let variant = Number(variantStr);
    if(isNaN(variant) || variant < 1 || variant > 1000)
      return this.errorMessage = "Вариант должен быть числом от 1 до 1000";

    this.errorMessage = null;

    new Observable<Task>((observer) => {
      if(!environment.production) {
        observer.next({
          variant: 1234,
          startWith: "004",
          cmds: [
            ["001", "0000", "0000"],
            ["002", "0000", "0000"],
            ["003", "4F22", "4F22"],
            ["004", "+ADD 003", "4003"],
            ["005", "HLT", "0100"]
          ]
        });
        observer.complete();
      }else{
        this.http.get<Task>(environment.programTracingApiEndpoint + (variant % (1000+1))).subscribe((resp: Task) => {
          observer.next(resp);
          observer.complete();
        }, (err) => {
          console.error(err);
          observer.error(err);
        });
      }
    }).subscribe((response: Task) => {
      this.taskVariant = {
        variant: variant,
        startWith: response.startWith,
        cmds: response.cmds,
        executableLines: 0
      };

      for(let i = 0; i < this.taskVariant.cmds.length; i++)
        if(this.isExecutable(i))
          this.taskVariant.executableLines += 1;
      this.shouldUpdateInputs = true;

      this.checks = {};
      this.answers = {};
      this.tryCount = 0;
      this.time = 0;
    });
  }


  checkLine(lineNo : number, inputs: HTMLInputElement[]) : void {
    //IP, CR, AR, DR, SP, BR, AC, NZVC
    this.gotoLine(lineNo);

    this.checks[lineNo] = this.checks[lineNo] || 0;
    this.checkReg(lineNo, reg.IP, inputs[0].value);
    this.checkReg(lineNo, reg.CR, inputs[1].value);
    this.checkReg(lineNo, reg.AR, inputs[2].value);
    this.checkReg(lineNo, reg.DR, inputs[3].value);
    this.checkReg(lineNo, reg.SP, inputs[4].value);
    this.checkReg(lineNo, reg.BR, inputs[5].value);
    this.checkReg(lineNo, reg.AC, inputs[6].value);

    this.checkNZVC(lineNo, inputs[7].value);
    this.tryCount += 1/this.taskVariant.executableLines;
    this.bcomp.sync(() => this.updateAnswerCounters());
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
    this.shouldUpdateInputs = true;
  }
}
