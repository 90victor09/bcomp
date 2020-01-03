import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import bcomp, { reg } from '../../../../src/bcomp';
import { BCompService } from "../../../../src/app/bcomp.service";

import { BCompCanvas } from "./bcomp-canvas";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  reg = reg;

  @ViewChild("busesCanvas", {static: true}) canvasRef : ElementRef;
  canvas : BCompCanvas;

  constructor(private bcompService: BCompService){ }

  ngAfterViewInit(){
    this.canvas = new BCompCanvas(this.canvasRef.nativeElement);
    // this.canvas.drawBus([
    //   [50, 100],
    //   [50, 50],
    //   [100, 50]
    // ]);
    // this.canvas.drawALU(10,10);

  }

  public getValue(reg: bcomp.regs) : number {
    return this.bcompService.regsValues[reg];
  }
}
