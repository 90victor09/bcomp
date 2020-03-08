import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import bcomp, { reg } from '../../../../src/bcomp';
import { BCompService } from "../../../../src/app/bcomp.service";

import { BCompCanvas } from "./bcomp-canvas";
import { GUIObjectManager } from "./object-manager";
import { buses } from "./bcomp-buses";
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

    let objectManager = new GUIObjectManager(this.canvasRef);
    objectManager.add("AC", this.regACRef);
    objectManager.add("BR", this.regBRRef);
    objectManager.add("PS", this.regPSRef);
    objectManager.add("IR", this.regIRRef);

    objectManager.add("DR", this.regDRRef);
    objectManager.add("CR", this.regCRRef);
    objectManager.add("IP", this.regIPRef);
    objectManager.add("SP", this.regSPRef);

    objectManager.add("input", this.regInputRef);
    objectManager.add("AR", this.regARRef);

    objectManager.add("ALU", this.ALURef);
    objectManager.add("COMM", this.COMMRef);
    objectManager.add("CU", this.CURef);
    objectManager.add("MEM", this.MEMRef);

    for(let key in buses)
      this.canvas.drawBus(buses[key](objectManager), false);
  }

  private constraint(name: string, val: any, elRef: ElementRef){
    elRef.nativeElement.style[name] = val;
  }

  public getValue(reg: bcomp.regs) : number {
    return this.bcompService.regsValues[reg];
  }
}
