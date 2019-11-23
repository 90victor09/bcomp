import { Component, OnInit } from '@angular/core';
import bcomp, { reg } from '../bcomp';
import { frankenstein } from "../frankenstein"
import { BCompService } from "./bcomp.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  reg = reg;

  constructor(private bcompService: BCompService){ }

  ngOnInit() : void {
    frankenstein(this.bcompService);
  }

  public getValue(reg: bcomp.regs) : number {
    return this.bcompService.regsValues[reg];
  }
}
