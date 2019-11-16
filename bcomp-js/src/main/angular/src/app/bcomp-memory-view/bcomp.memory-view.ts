import {Component, Input} from '@angular/core';
import {BCompService} from "../bcomp.service";

@Component({
  selector: 'bcomp-memory-view',
  templateUrl: './bcomp.memory-view.html',
  styleUrls: ['./bcomp.memory-view.scss']
})
export class BCompMemoryView {
  constructor(private bcompService: BCompService){ }
}
