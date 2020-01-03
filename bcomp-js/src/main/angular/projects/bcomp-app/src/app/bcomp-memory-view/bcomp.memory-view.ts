import { Component } from '@angular/core';
import { BCompService } from "../../../../../src/app/bcomp.service";

@Component({
  selector: 'bcomp-memory-view',
  templateUrl: './bcomp.memory-view.html',
  styleUrls: ['./bcomp.memory-view.scss']
})
export class BCompMemoryView {
  constructor(public bcompService: BCompService){ }
}
