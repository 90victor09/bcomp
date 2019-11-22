// declare  var bcomp:  any;

declare var loadBComp: () => void;
loadBComp();

type RegValue = number;
type MemoryAddress = number;
type MemoryValue = number;

declare namespace bcomp {
  export const regs : string[];
  export const runningCycles : string[];
  export const controlSignals : string[];
  export const states : string[];

  function sleep(ms: number) : void;
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
  sync(cb: () => void) : void;

  setRegValue(reg: string, value: RegValue) : void;
  getRegValue(reg: string, cb: (value: RegValue) => void) : void;
  getRegWidth(reg: string, cb: (width: number) => void) : void;

  getRunningCycle(cb: (cycle: string) => void) : void;

  addSignalListener(signal: string, cb: (value: number) => void) : void;
  setTickStartListener(cb: () => void) : void;
  setTickFinishListener(cb: () => void) : void;

  executeContinue(cb: () => void) : void;

  setMemoryValue(addr: MemoryAddress, value: MemoryValue) : void;
  getMemoryValue(addr: MemoryAddress, cb: (value: MemoryValue) => void) : void;
  getLastAccessedMemoryAddress(cb: (value: MemoryAddress) => void) : void;
}
