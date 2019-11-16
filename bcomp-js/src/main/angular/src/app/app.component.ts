import {Component, OnInit} from '@angular/core';
import {reg} from '../bcomp';
import {frankenstein} from "../frankenstein"
import {BCompService} from "./bcomp.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  reg = reg;
  title = 'bcomp-app';

  constructor(private bcompService: BCompService){
  }

  ngOnInit(): void {
    frankenstein(this.bcompService);
  }

  private getValue(reg: string) : number {
    return this.bcompService.regsValues[reg];
  }
}
