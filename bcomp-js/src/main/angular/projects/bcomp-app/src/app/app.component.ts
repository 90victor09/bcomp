import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import bcomp, { cs, reg } from '../../../../src/bcomp';
import { BCompService } from "../../../../src/app/bcomp.service";

import { BCompCanvas } from "./bcomp-canvas";
import { GUIObjectManager } from "./object-manager";
import { Buses, buses } from "./bcomp-buses";
import {
  aluHeight,
  aluWidth, canvasHeight,
  canvasWidth,
  commWidth, controlUnitHeight,
  controlUnitWidth,
  leftRegsRight, memHeight, memRight, memTop, memWidth, rightRegsBusX,
  rightRegsLeft
} from "./gui-constraints";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  reg = reg;

  @ViewChild("AC", {static: true, read: ElementRef}) regACRef: ElementRef;
  @ViewChild("BR", {static: true, read: ElementRef}) regBRRef: ElementRef;
  @ViewChild("PS", {static: true, read: ElementRef}) regPSRef: ElementRef;
  @ViewChild("IR", {static: true, read: ElementRef}) regIRRef: ElementRef;

  @ViewChild("DR", {static: true, read: ElementRef}) regDRRef: ElementRef;
  @ViewChild("CR", {static: true, read: ElementRef}) regCRRef: ElementRef;
  @ViewChild("IP", {static: true, read: ElementRef}) regIPRef: ElementRef;
  @ViewChild("SP", {static: true, read: ElementRef}) regSPRef: ElementRef;

  @ViewChild("input", {static: true, read: ElementRef}) regInputRef: ElementRef;
  @ViewChild("AR", {static: true, read: ElementRef}) regARRef: ElementRef;

  @ViewChild("ALU", {static: true, read: ElementRef}) ALURef: ElementRef;
  @ViewChild("COMM", {static: true, read: ElementRef}) COMMRef: ElementRef;
  @ViewChild("CU", {static: true, read: ElementRef}) CURef: ElementRef;
  @ViewChild("MEM", {static: true, read: ElementRef}) MEMRef: ElementRef;

  @ViewChild("busesCanvas", {static: true}) canvasRef : ElementRef;
  canvas : BCompCanvas;
  private objectManager: GUIObjectManager;
  private activeBuses: Buses[] = [];

  constructor(private bcompService: BCompService){ }

  ngAfterViewInit(){
    this.constraint("right", (leftRegsRight*100) + '%', this.regACRef);
    this.constraint("right", (leftRegsRight*100) + '%', this.regBRRef);
    this.constraint("right", (leftRegsRight*100) + '%', this.regPSRef);
    this.constraint("right", (leftRegsRight*100) + '%', this.regIRRef);

    this.constraint("left", (rightRegsLeft*100) + '%', this.regDRRef);
    this.constraint("left", (rightRegsLeft*100) + '%', this.regCRRef);
    this.constraint("left", (rightRegsLeft*100) + '%', this.regIPRef);
    this.constraint("left", (rightRegsLeft*100) + '%', this.regSPRef);

    // center between regs
    let aluDoubleLeft = (rightRegsLeft + (1-leftRegsRight) - aluWidth);
    this.constraint("left", aluDoubleLeft*50 + '%', this.ALURef);
    this.constraint("height", (aluHeight * 100) + '%', this.ALURef);
    this.constraint("width", (aluWidth * 100) + '%', this.ALURef);

    this.constraint("left", ((rightRegsLeft + (1-leftRegsRight) - commWidth)*50) + '%', this.COMMRef);
    this.constraint("width", (commWidth*canvasWidth) + 'px', this.COMMRef);

    // center between ALU & right regs buses
    this.constraint("left", ((rightRegsBusX + (aluDoubleLeft/2 + aluWidth) - controlUnitWidth)*50) + '%', this.CURef);
    this.constraint("height", (controlUnitHeight*canvasHeight) + 'px', this.CURef);
    this.constraint("width", (controlUnitWidth*canvasWidth) + 'px', this.CURef);

    this.constraint("right", (memRight*canvasWidth) + 'px', this.MEMRef);
    this.constraint("top", (memTop * canvasHeight) + 'px', this.MEMRef);
    this.constraint("width", (memWidth*canvasWidth) + 'px', this.MEMRef);
    this.constraint("height", (memHeight*canvasHeight) + 'px', this.MEMRef);

    this.canvas = new BCompCanvas(this.canvasRef.nativeElement);

    this.objectManager = new GUIObjectManager(this.canvasRef);
    this.objectManager.add("AC", this.regACRef);
    this.objectManager.add("BR", this.regBRRef);
    this.objectManager.add("PS", this.regPSRef);
    this.objectManager.add("IR", this.regIRRef);

    this.objectManager.add("DR", this.regDRRef);
    this.objectManager.add("CR", this.regCRRef);
    this.objectManager.add("IP", this.regIPRef);
    this.objectManager.add("SP", this.regSPRef);

    this.objectManager.add("input", this.regInputRef);
    this.objectManager.add("AR", this.regARRef);

    this.objectManager.add("ALU", this.ALURef);
    this.objectManager.add("COMM", this.COMMRef);
    this.objectManager.add("CU", this.CURef);
    this.objectManager.add("MEM", this.MEMRef);

    for(let key in buses)
      this.canvas.drawBus(buses[key](this.objectManager), false);

    this.bcompService.addSignalsListener([cs.RDBR], () => this.activateBus(Buses.BR_ALU));
    this.bcompService.addSignalsListener([cs.WRBR], () => this.activateBus(Buses.COMM_BR));
    this.bcompService.addSignalsListener([cs.RDPS], () => this.activateBus(Buses.PS_ALU));
    this.bcompService.addSignalsListener([cs.WRPS], () => this.activateBus(Buses.COMM_PS));
    this.bcompService.addSignalsListener([cs.WRBR, cs.WRAC, cs.WRIP, cs.WRCR, cs.WRDR, cs.WRAR, cs.WRPS, cs.WRSP, cs.TYPE], () => this.activateBus(Buses.COMM_ALL));
    this.bcompService.addSignalsListener([cs.WRBR, cs.WRAC, cs.WRIP, cs.WRCR, cs.WRDR, cs.WRAR, cs.WRPS, cs.WRSP, cs.TYPE], () => this.activateBus(Buses.ALU_COMM));
    this.bcompService.addSignalsListener([cs.RDDR], () => this.activateBus(Buses.DR_ALU));
    this.bcompService.addSignalsListener([cs.RDCR], () => this.activateBus(Buses.CR_ALU));
    this.bcompService.addSignalsListener([cs.RDIP], () => this.activateBus(Buses.IP_ALU));
    this.bcompService.addSignalsListener([cs.RDSP], () => this.activateBus(Buses.SP_ALU));
    this.bcompService.addSignalsListener([cs.RDAC], () => this.activateBus(Buses.AC_ALU));
    this.bcompService.addSignalsListener([cs.RDIR], () => this.activateBus(Buses.IR_ALU));
    this.bcompService.addSignalsListener([cs.WRAR], () => this.activateBus(Buses.COMM_AR));
    this.bcompService.addSignalsListener([cs.WRDR], () => this.activateBus(Buses.COMM_DR));
    this.bcompService.addSignalsListener([cs.WRCR], () => this.activateBus(Buses.COMM_CR));
    this.bcompService.addSignalsListener([cs.WRIP], () => this.activateBus(Buses.COMM_IP));
    this.bcompService.addSignalsListener([cs.WRSP], () => this.activateBus(Buses.COMM_SP));
    this.bcompService.addSignalsListener([cs.WRAC], () => this.activateBus(Buses.COMM_AC));
    this.bcompService.addSignalsListener([cs.LOAD, cs.STOR], () => this.activateBus(Buses.MEM_IO));
    this.bcompService.addSignalsListener([cs.LOAD], () => this.activateBus(Buses.MEM_R));
    this.bcompService.addSignalsListener([cs.STOR], () => this.activateBus(Buses.MEM_W));
    this.bcompService.addSignalsListener([cs.TYPE], () => this.activateBus(Buses.CU));

    this.bcompService.addSignalsListener([], () => this)

    this.bcompService.addTickStartListener(() => {
      let b;
      while((b = this.activeBuses.pop()) != undefined)
        this.canvas.drawBus(buses[b](this.objectManager), false);
    });
  }

  cmdEnterAddr(){
    this.bcompService.startSetAddr();
  }
  cmdWrite(){
    this.bcompService.startWrite();
  }
  cmdRead(){
    this.bcompService.startRead();
  }
  cmdInvertRunState(e){
    e.target.checked = this.bcompService.invertRunState();
  }
  cmdInvertClockState(e){
    console.log(e.target.checked = this.bcompService.invertClockState());
  }
  cmdStart(){
    this.bcompService.startStart();
  }
  cmdContinue(){
    this.bcompService.startContinue();
  }

  private activateBus(bus: Buses){
    this.canvas.drawBus(buses[bus](this.objectManager), true);
    this.activeBuses.push(bus);
  }

  private constraint(name: string, val: any, elRef: ElementRef){
    elRef.nativeElement.style[name] = val;
  }

  public getValue(reg: bcomp.regs) : number {
    return this.bcompService.regsValues[reg];
  }
}
