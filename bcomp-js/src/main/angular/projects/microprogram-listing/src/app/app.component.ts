import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import bcomp, { BCompAngular } from "../../../../src/bcomp";
import { animate, AnimationBuilder, style } from "@angular/animations";
import { toHex } from "../../../../src/common";

function hsv(h: number, s: number, v: number) : string {
  h = Math.max(0, Math.min(360, h));
  s = Math.max( 0, Math.min(100, s))/100;
  v = Math.max( 0, Math.min(100, v))/100;

  let f = (n) => {
    let k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };

  const r = (f(5)*255) | 0;
  const g = (f(3)*255) | 0;
  const b = (f(1)*255) | 0;

  return "#" + (r < 17 ? "0" : "") + r.toString(16)
    + (g < 17 ? "0" : "") + g.toString(16)
    + (b < 17 ? "0" : "") + b.toString(16);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  private bcomp: BCompAngular;

  jumpColor: string = "yellow";
  // [hsb saturation 45, hsb brightness 85]
  colors = {
    /*INFETCH: ["#9cff8c","#89d977"], //"#86FF75"
    ADFETCH: ["#7ee691","#77d987"], //"#6BE882"
    OPFETCH: ["#8cffc2","#77d9a3"], //"#81FFBC"
    EXEC: ["#7ee6cc","#77d9bd"], //"#6BE8C9"
    INT: ["#8cfdff","#77d9d9"], //"#75FBFF"
    START: ["#7ec8e6","#77bfd9"], //"#5FBFE8"
    READ: ["#8cc0ff","#77a5d9"], //"#69ABFF"
    // saturation 35
    WRITE: ["#95a4e6","#8d9dd9"], //"#546DE8"
    SETIP: ["#968cff","#7e77d9"], //"#6C5CFF"
    STOP: ["#a47ee6","#9877d9"], //"#8448E8"
    RESERVED: ["#d58cff","#b277d9"], //"#C14FFF"*/

    INFETCH:  [hsv(111,45,100), hsv(111,45,85)],
    ADFETCH:  [hsv(130,45,90),  hsv(130,45,85)],
    OPFETCH:  [hsv(148,45,100), hsv(148,45,85)],
    EXEC:     [hsv(165,45,90),  hsv(165,45,85)],
    INT:      [hsv(181,45,100), hsv(181,45,85)],
    START:    [hsv(197,45,90),  hsv(197,45,85)],
    READ:     [hsv(212,45,100), hsv(212,45,85)],
    // saturation 35
    WRITE:    [hsv(228,40,90),  hsv(228,40,85)],
    SETIP:    [hsv(245,35,100), hsv(245,35,85)],
    STOP:     [hsv(261,40,90),  hsv(261,40,85)],
    RESERVED: [hsv(248,35,100), hsv(248,35,85)],
  };

  public decodedMCs: string[][] = [];

  constructor(public animationBuilder: AnimationBuilder, private cdRef: ChangeDetectorRef){ }

  private shouldProcessJump = false;
  ngOnInit(): void {
    this.bcomp = bcomp.startAngular(() => {
      this.bcomp.getRegWidth(bcomp.regs.MP, (width) => {
        let requested = (1<<width)-1, received = 0;
        for(let i = 0; i <= requested; i++){
          this.bcomp.decodeMC(i, (value: string[]) => {
            this.decodedMCs[i] = value;
            received++;
            if(requested == received){
              this.shouldProcessJump = true;
              this.cdRef.detectChanges();
            }
          });
        }
      });
    });
    this.genStylesheets();
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
    style({ boxShadow: 'inset 0 0 5px ' + this.jumpColor, backgroundColor: this.jumpColor }),
    animate('1s 0.5s', style({}))
  ]);
  jumpTo(to: {lbl: boolean, val: number | string}) : void {
    let el = document.getElementById((to.lbl ? 'L' : 'A') + '-' + (to.lbl ? to.val : toHex(<number>to.val,2)));
    if(!el)
      return;
    el.scrollIntoView();
    this.jumpAnimationBuilder.create(el.parentNode).play();
  }

  genStylesheets() : void {
    let styleElement = document.createElement("style");

    let labels = Object.keys(this.colors);
    styleElement.innerText += "tbody tr { background-color: " + this.colors[labels[labels.length-1]][0] + "; } ";

    for(let i = 0; i < labels.length; i++){
      styleElement.innerText += "tr[data-label='" + labels[i] + "'] { background-color: " + this.colors[labels[i]][0] + " !important;} ";
      styleElement.innerText += "tr[data-label='" + labels[i] + "'] ~ tr { background-color: " + this.colors[labels[i]][0] + "; } ";
      styleElement.innerText += "tr[data-label='" + labels[i] + "'].darker { background-color: " + this.colors[labels[i]][1] + " !important;} ";
      styleElement.innerText += "tr[data-label='" + labels[i] + "'] ~ tr.darker { background-color: " + this.colors[labels[i]][1] + "; } ";
    }
    document.head.append(styleElement);
  }
}
