import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BCompCanvas } from "../bcomp-canvas";
import { aluHeight, aluWidth, canvasHeight, canvasWidth } from "../gui-constraints";

@Component({
  selector: 'bcomp-alu',
  templateUrl: './bcomp-alu.component.html',
  styleUrls: ['./bcomp-alu.component.scss']
})
export class BCompALUComponent implements AfterViewInit {

  @ViewChild("canvas", {static: true}) canvasRef : ElementRef;
  canvas : BCompCanvas;
  width: number;
  height: number;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvasRef.nativeElement.width = aluWidth*canvasWidth;
    this.canvasRef.nativeElement.height = aluHeight*canvasHeight;

    this.canvas = new BCompCanvas(this.canvasRef.nativeElement);

    this.canvas.drawALU();
  }

}
