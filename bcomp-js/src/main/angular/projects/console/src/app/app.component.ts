import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import bcomp, { BCompCLI } from "../../../../src/bcomp";

const MAX_CMDS_HISTORY = 100;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private history: string[] = [];
  private historyCur: number = -1;

  @ViewChild("console", {static: true}) consoleRef: ElementRef;
  private console: HTMLPreElement;
  @ViewChild("input", {static: true}) inputRef: ElementRef;
  private input: HTMLInputElement;

  private bcomp: BCompCLI;

  ngAfterViewInit(): void {
    this.console = this.consoleRef.nativeElement;
    this.input = this.inputRef.nativeElement;

    this.bcomp = bcomp.startCLI(this.console);
  }

  enterLine(e: Event){
    e.preventDefault();
    let cmd = this.input.value;
    this.history.unshift(this.input.value);

    if(this.history.length > MAX_CMDS_HISTORY)
      this.history.pop();

    console.log(this.history);

    this.historyCur = -1;
    this.input.value = "";

    this.bcomp.enterLine(cmd);
  }

  keyPress(e: KeyboardEvent){
    if(e.key == "Enter"){
      this.enterLine(e);
    }else
    if(e.key == "ArrowUp" || e.key == "Up"){
      e.preventDefault();
      if(this.historyCur >= this.history.length-1)
        return;

      this.historyCur++;
      this.input.value = this.history[this.historyCur];
    }else
    if(e.key == "ArrowDown" || e.key == "Down"){
      e.preventDefault();
      if(this.historyCur < 0)
        return;

      this.historyCur--;
      this.input.value = (this.historyCur == -1 ? "" : this.history[this.historyCur]);
    }
  }

}
