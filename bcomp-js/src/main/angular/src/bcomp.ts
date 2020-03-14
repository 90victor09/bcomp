// declare  var bcomp:  any;

declare var loadBComp: () => void;
loadBComp();

type RegValue = number;
type MemoryAddress = number;
type MemoryValue = number;

declare namespace bcomp {
  // export const regs : string[];
  // export const runningCycles : string[];
  // export const controlSignals : string[];
  // export const states : string[];

  export enum regs {
    DR,
    CR,
    IP,
    SP,
    AC,
    BR,
    PS,
    IR,
    AR,
    MR,
    MP
  }
  export enum runningCycles {
    INFETCH,
    ADFETCH,
    OPFETCH,
    EXEC,
    INT,
    START,
    READ,
    WRITE,
    SETIP,
    STOP,
    RESERVED
  }
  export enum controlSignals {
    RDDR,
    RDCR,
    RDIP,
    RDSP,
    RDAC,
    RDBR,
    RDPS,
    RDIR,
    COMR,
    COML,
    PLS1,
    SORA,
    LTOL,
    LTOH,
    HTOL,
    HTOH,
    SEXT,
    SHLT,
    SHL0,
    SHRT,
    SHRF,
    SETC,
    SETV,
    STNZ,
    WRDR,
    WRCR,
    WRIP,
    WRSP,
    WRAC,
    WRBR,
    WRPS,
    WRAR,
    LOAD,
    STOR,
    IO,
    CLRF,
    DINT,
    EINT,
    HALT,
    TYPE,
    SET_RUN_STATE,
    SET_PROGRAM,
    CLOCK0,
    CLOCK1,
    SET_REQUEST_INTERRUPT,
    IO0_TSF,
    IO1_SETFLAG,
    IO1_TSF,
    IO1_OUT,
    IO2_SETFLAG,
    IO2_TSF,
    IO2_IN,
    IO3_SETFLAG,
    IO3_TSF,
    IO3_IN,
    IO3_OUT,
    IO4_TSF,
    IO5_TSF,
    IO6_TSF,
    IO7_TSF,
    IO7_IN,
    IO8_TSF,
    IO8_IN,
    IO9_TSF,
    IO9_IN,
  }
  export enum states {
    C,
    V,
    Z,
    N,
    F,
    PS0,
    EI,
    INTR,
    IOREADY,
    RUN,
    PROG
  }

  function sleep(ms: number) : void;
  function startCLI(el: HTMLElement) : BCompCLI;
  function startAngular(cb: () => void) : BCompAngular;
}
export default bcomp;

export let reg = bcomp.regs;
export let cycle = bcomp.runningCycles;
export let cs = bcomp.controlSignals;
export let state = bcomp.states;

export interface BCompCLI {
  enterLine(line: String) : void;
  sync(cb: () => void) : void;
}

export interface BCompAngular {
  sync(cb: () => void) : void;

  setRegValue(reg: bcomp.regs, value: RegValue) : void;
  getRegValue(reg: bcomp.regs, cb: (value: RegValue) => void) : void;
  getRegWidth(reg: bcomp.regs, cb: (width: number) => void) : void;

  setMemoryValue(addr: MemoryAddress, value: MemoryValue) : void;
  getMemoryValue(addr: MemoryAddress, cb: (value: MemoryValue) => void) : void;
  getLastAccessedMemoryAddress(cb: (value: MemoryAddress) => void) : void;

  startContinue();
  startSetAddr();
  startWrite();
  startRead();
  startStart();

  executeContinue(cb: () => void) : void;

  getRunningCycle(cb: (cycle: bcomp.runningCycles) => void) : void;
  decodeMC(addr: MemoryAddress, cb: (value: string[]) => void) : void;

  getClockState(cb: (clock: boolean) => void) : void;
  setClockState(clock: boolean) : void;

  addSignalListener(signal: bcomp.controlSignals, cb: (value: number) => void) : void;
  setTickStartListener(cb: () => void) : void;
  setTickFinishListener(cb: () => void) : void;


}
