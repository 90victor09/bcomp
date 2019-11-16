// declare  var bcomp:  any;

declare var loadBComp: () => void;
loadBComp();

declare namespace bcomp {
  export const regs : string[];
  export const runningCycles : string[];
  export const controlSignals : string[];
  export const states : string[];

  function startCLI(el: HTMLElement) : BCompCLI;
  function startAngular(cb: () => void) : BCompAngular;
  function startFrankenstein(cb: () => void) : BCompAngular; //TODO delete this
}
export default bcomp;

// Creating some sort of type safety
function genStringEnum(en: string[]) : any {
  let tmp = {};
  for(let t of en)
    tmp[t] = t;
  return tmp;
}

export let reg = genStringEnum(bcomp.regs);
export let cycle = genStringEnum(bcomp.runningCycles);
export let cs = genStringEnum(bcomp.controlSignals);
export let state = genStringEnum(bcomp.states);

export interface BCompCLI {
  enterLine(line: String) : void;
}

export interface BCompAngular {
  getRegValue(reg: string, cb: (value: string) => void) : void;
  getRegWidth(reg: string, cb: (width: number) => void) : void;
  getRunningCycle(cb: (cycle: string) => void) : void;
  addSignalListener(signal: string, cb: (value: string) => void) : void;
  setTickStartListener(cb: () => void) : void;
  setTickFinishListener(cb: () => void) : void;
  getMemoryValue(addr: number, cb: (value: string) => void) : void;
  getLastAccessedMemoryAddress(cb: (value: number) => void) : void;
}
