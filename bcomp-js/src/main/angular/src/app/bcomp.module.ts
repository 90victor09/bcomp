import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { BCompService } from "./bcomp.service";
import { BinaryPipe } from "./binary.pipe";
import { HexadecimalPipe } from "./hexadecimal.pipe";
import { GroupByPipe } from "./group-by.pipe";

@NgModule({
  declarations: [
    BinaryPipe,
    HexadecimalPipe,
    GroupByPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BinaryPipe,
    HexadecimalPipe,
    GroupByPipe
  ]
  // providers: [BCompService]
})
export class BCompModule { }
