// declare  var bcomp:  any;

declare var main: any;
main();
bcomp.startAngular();

declare namespace bcomp {
  function startCLI(el: HTMLPreElement) : BCompCLI;
  function startAngular() : BCompAngular;
}
interface BCompCLI {
  enterLine(line: String) : void;
}

interface BCompAngular {
  getRegValue(reg: string, cb) : string;
  getRegWidth(reg: string, cb) : string;
  getRunningCycle(cb) : string;
}
