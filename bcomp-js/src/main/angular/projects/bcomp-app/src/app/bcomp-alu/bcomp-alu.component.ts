import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BCompCanvas } from "../bcomp-canvas";

const ALU_WIDTH = 181;
const ALU_HEIGHT = 80;

@Component({
  selector: 'bcomp-alu',
  templateUrl: './bcomp-alu.component.html',
  styleUrls: ['./bcomp-alu.component.scss']
})
export class BCompALUComponent implements AfterViewInit {

  @ViewChild("canvas", {static: true}) canvasRef : ElementRef;
  canvas : BCompCanvas;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = new BCompCanvas(this.canvasRef.nativeElement);

    this.canvas.drawALU(0,0, 181, 80);
  }

}
