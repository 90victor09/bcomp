import bcomp from "./bcomp"
import { BCompService } from "./app/bcomp.service";

//TODO delete this

export function frankenstein(bcompService: BCompService) {
  let consoleEl: HTMLPreElement = <HTMLPreElement>document.getElementById("console");
  let consoleInputEl: HTMLInputElement = <HTMLInputElement>document.getElementById("console-input");

  let bcompConsole = bcomp.startCLI(consoleEl);
  let bcompFrankenstein;
  setTimeout(function(){
    bcompFrankenstein = bcomp.startFrankenstein(() => {
      bcompService.updateRegs();
      console.log("inited");
    });
    bcompService.setBComp(bcompFrankenstein);
  },1000);

  consoleInputEl.onkeydown = function (e) {
    if (e.keyCode !== 13)
      return;
    bcompConsole.enterLine(consoleInputEl.value);
    consoleInputEl.value = "";
  };
}
