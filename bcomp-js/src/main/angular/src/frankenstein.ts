import bcomp from "./bcomp"
import { BCompService } from "./app/bcomp.service";

//TODO delete this

export function frankenstein(bcompService: BCompService) {
  let consoleEl: HTMLPreElement = <HTMLPreElement>document.getElementById("console");
  let consoleInputEl: HTMLInputElement = <HTMLInputElement>document.getElementById("console-input");

  let bcompConsole = bcomp.startCLI(consoleEl);
  let bcompFrankenstein;
  bcompConsole.sync(() => {
    bcompFrankenstein = bcomp.startFrankenstein(() => bcompService.updateRegs());
    bcompService.setBComp(bcompFrankenstein);
  });

  consoleInputEl.onkeydown = function (e) {
    if (e.keyCode !== 13)
      return;
    bcompConsole.enterLine(consoleInputEl.value);
    consoleInputEl.value = "";
  };
}
