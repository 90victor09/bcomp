import { Component } from '@angular/core';
import bcomp, { reg } from "../../../../src/bcomp";
import { setBit, toHex } from "../../../../src/common";
import { BCompTracer } from "../../../program-tracing/src/app/bcomp-tracer.class";
import { Observable } from "rxjs";
import { environment } from "../../../program-tracing/src/environments/environment";
import { HttpClient } from "@angular/common/http";

interface Task {
  variant: number,
  cmd: string[],
  mem: string[],
  regs: string[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BCompTracer {
  taskVariant : {variant: number, executableLines: number, cmd: string[], mem: string[], regs: string[] } = {
    variant: 0,
    executableLines: 0,

    // Addr Text Value
    cmd: ["00E", "ADD (000)", "4800"],
    // Addr Value
    mem: ["000", "F00E"],
    regs: [
      // "", //MPbefore
      // "", //MEM
      "0000000000", //MR
      "000", //IP
      "0000", //CR
      "000", //AR
      "0000", //DR
      "000", //SP
      "0000", //BR
      "0000", //AC
      "0000", //NZVC
      // "", //MPafter
    ]
  };

  iterableArray = new Array(0);

  constructor(private http: HttpClient) {
    super();
  }

  getExecutionStartLine(): number {
    return 0;
  }
  getTotalLines(): number {
    if(!this.taskVariant)
      return 0;
    return this.taskVariant.executableLines;
  }

  // Override
  setupBComp() : void {
    this.bcomp.setRegValue(reg.MR, Number("0x" + this.taskVariant.regs[0]));
    this.bcomp.setRegValue(reg.IP, Number("0x" + this.taskVariant.regs[1]));
    this.bcomp.setRegValue(reg.CR, Number("0x" + this.taskVariant.regs[2]));
    this.bcomp.setRegValue(reg.AR, Number("0x" + this.taskVariant.regs[3]));
    this.bcomp.setRegValue(reg.DR, Number("0x" + this.taskVariant.regs[4]));
    this.bcomp.setRegValue(reg.SP, Number("0x" + this.taskVariant.regs[5]));
    this.bcomp.setRegValue(reg.BR, Number("0x" + this.taskVariant.regs[6]));
    this.bcomp.setRegValue(reg.AC, Number("0x" + this.taskVariant.regs[7]));

    this.bcomp.setRegValue(reg.PS, Number("0b" + this.taskVariant.regs[8]));

    this.bcomp.setMemoryValue(Number("0x" + this.taskVariant.mem[0]), Number("0x" + this.taskVariant.mem[1]));

    this.bcomp.setRegValue(reg.MP, 1);

    this.bcomp.setClockState(true);
  }


  //Override
  fetchTask(variantStr: string | number){
    let variant = Number(variantStr);
    if(isNaN(variant) || variant < 1 || variant > 1000)
      return this.errorMessage = "Вариант должен быть числом от 1 до 1000";

    this.errorMessage = null;

    new Observable<Task>((observer) => {
      if(!environment.production) {
        observer.next({ //TODO
          variant: 0,
          cmd: ["00E", "ADD (000)", "4800"],
          mem: ["000", "F00E"],
          regs: [
            // "", //MPbefore
            // "", //MEM
            "", //MR
            "", //IP
            "", //CR
            "", //AR
            "", //DR
            "", //SP
            "", //BR
            "", //AC
            "", //NZVC
            // "", //MPafter
          ]
        });
        observer.complete();
      }else{
        this.http.get<Task>(environment.microprogramTracingApiEndpoint + (variant % (1000+1))).subscribe((resp: Task) => {
          observer.next(resp);
          observer.complete();
        }, (err) => {
          console.error(err);
          observer.error(err);
        });
      }
    }).subscribe((response: Task) => {
      this.shouldUpdateInputs = true;
      this.taskVariant = {
        variant: variant,
        cmd: response.cmd,
        mem: response.mem,
        regs: response.regs,
        executableLines: 0
      };

      this.setupBComp();
      //BUG: fetching execution lines count before finishing
      let lines = 0;
      const continueUntilHalt = () => {
        lines++;
        this.bcomp.executeContinue(() => {
          this.bcomp.getRegValue(reg.MR, (cmd: number) => {
            if ((cmd & (1 << bcomp.controlSignals.TYPE)) == 0 && (cmd & (1 << bcomp.controlSignals.HALT)) != 0){
              this.taskVariant.executableLines = lines;
              this.iterableArray = new Array(lines);
            }else
              continueUntilHalt();
          })
        });
      };

      continueUntilHalt();

      this.checks = {};
      this.answers = {};
      this.tryCount = 0;
      this.time = 0;
    });
  }


  // Override
  checkLine(lineNo : number, inputs: HTMLInputElement[]) : void {
    //MPbefore, MEM, MR, IP, CR, AR, DR, SP, BR, AC, NZVC, MPafter
    this.checks[lineNo] = this.checks[lineNo] || 0;
    if(lineNo != 0) {
      this.gotoLine(lineNo - 1);
      this.checkReg(lineNo, this.iMPbefore, inputs[0].value);
    }

    this.gotoLine(lineNo);

    this.bcomp.getMemoryValue(Number("0x" + this.taskVariant.mem[0]), (value: number) => {
      this.checks[lineNo] = setBit(this.checks[lineNo], this.iMEM, value == Number("0x" + inputs[1].value));
    });

    this.checkReg(lineNo, reg.MR, inputs[2].value);
    this.checkReg(lineNo, reg.IP, inputs[3].value);
    this.checkReg(lineNo, reg.CR, inputs[4].value);
    this.checkReg(lineNo, reg.AR, inputs[5].value);
    this.checkReg(lineNo, reg.DR, inputs[6].value);
    this.checkReg(lineNo, reg.SP, inputs[7].value);
    this.checkReg(lineNo, reg.BR, inputs[8].value);
    this.checkReg(lineNo, reg.AC, inputs[9].value);

    this.checkNZVC(lineNo, inputs[10].value);
    this.checkReg(lineNo, reg.MP, inputs[11].value);
    this.tryCount += 1/this.taskVariant.executableLines;
  }


  // Override
  showAnswer(lineNo: number) : void {
    this.answers[lineNo] = this.answers[lineNo] || [];
    if(lineNo != 0){
      this.gotoLine(lineNo - 1);
      this.showRegAnswer(lineNo, reg.MP, this.iMPbefore);
    }
    this.gotoLine(lineNo);

    this.bcomp.getMemoryValue(Number("0x" + this.taskVariant.mem[0]), (value: number) => {
      this.answers[lineNo][this.iMEM] = toHex(value, 4)
    });

    this.showRegAnswer(lineNo, reg.MR);
    this.showRegAnswer(lineNo, reg.IP);
    this.showRegAnswer(lineNo, reg.CR);
    this.showRegAnswer(lineNo, reg.AR);
    this.showRegAnswer(lineNo, reg.DR);
    this.showRegAnswer(lineNo, reg.SP);
    this.showRegAnswer(lineNo, reg.BR);
    this.showRegAnswer(lineNo, reg.AC);

    this.formNZVC((val) => this.answers[lineNo][this.iNZVC] = val);
    this.showRegAnswer(lineNo, reg.MP);
  }
}
