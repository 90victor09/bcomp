import { AfterViewChecked, Component, OnInit } from '@angular/core';
import bcomp, { BCompAngular } from "../../../../src/bcomp";
import { animate, animation, AnimationBuilder, state, style, transition, trigger } from "@angular/animations";
import { toHex } from "../../../../src/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  private bcomp: BCompAngular;

  public decodedMCs: string[][] = [];

  constructor(public animationBuilder: AnimationBuilder){ }

  private shouldProcessJump = false;
  ngOnInit(): void {
    this.bcomp = bcomp.startAngular(() => {
      this.bcomp.getRegWidth(bcomp.regs.MP, (width) => {
        let requested = (1<<width)-1, received = 0;
        for(let i = 0; i <= requested; i++){
          this.bcomp.decodeMC(i, (value: string[]) => {
            this.decodedMCs[i] = value;
            received++;
            if(requested == received)
              this.shouldProcessJump = true;
          });
        }
      });
    });
  }

  ngAfterViewChecked(): void {
    if(!this.shouldProcessJump)
      return;
    this.shouldProcessJump = false;

    let hash = String(window.location.hash);
    window.location.hash = hash;
    let arg = hash.substring(hash.indexOf('-')+1);
    if(hash[1] == 'A')
      this.jumpTo({lbl: false, val: Number('0x' + arg)});
    else if(hash[1] == 'L')
      this.jumpTo({lbl: true, val: arg});
  }

  private jumpAnimationBuilder = this.animationBuilder.build([
    style({ boxShadow: 'inset 0 0 5px yellow' }),
    animate('1s 0.5s', style({ boxShadow: 'none' }))
  ]);
  jumpTo(to: {lbl: boolean, val: number | string}) : void {
    let el = document.getElementById((to.lbl ? 'L' : 'A') + '-' + (to.lbl ? to.val : toHex(<number>to.val,2)));
    if(!el)
      return;
    this.jumpAnimationBuilder.create(el.parentNode).play();
  }
}
