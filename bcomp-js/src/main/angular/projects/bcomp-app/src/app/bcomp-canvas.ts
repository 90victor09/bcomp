import { busWidth } from "./gui-constraints";

type Vec = { [n: number]: number }; //[number. number];

const X = 0;
const Y = 1;

const ALU_BACKGROUND_STYLE = "rgb(157, 189, 165)";
const ALU_BORDER_STYLE = "rgb(0,0,0)";
const ALU_BORDER_WIDTH = 1;


const BUS_STYLE = "rgb(128, 128, 128)";
const BUS_STYLE_ACTIVE = "#F00";

const ARROW_WIDTH = 25;

export class BCompCanvas {
  private readonly ctx: CanvasRenderingContext2D;
  constructor(el: HTMLCanvasElement){
    this.ctx = el.getContext("2d");
  }

  getWidth(){
    return this.ctx.canvas.width;
  }
  getHeight(){
    return this.ctx.canvas.height;
  }

  drawALU() : void {
    let width = this.getWidth();
    let height = this.getHeight();

    let half = width / 2;
    let offset = height / 3;
    let soffset = offset / 3;

    this.ctx.lineWidth = ALU_BORDER_WIDTH;
    this.ctx.strokeStyle = ALU_BORDER_STYLE;
    this.ctx.fillStyle = ALU_BACKGROUND_STYLE;

    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(half - soffset,0);
    this.ctx.lineTo(half,offset);
    this.ctx.lineTo(half + soffset,0);
    this.ctx.lineTo(width - 1,0);
    this.ctx.lineTo(width - 1 - offset, height - 1);
    this.ctx.lineTo(offset,height - 1);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = "black";
    this.ctx.font = Math.round(height - offset) + 'px serif';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText('ALU', width/2, offset + (height - offset)/2);
  }



  drawBus(pnts: Vec[], active: boolean) : void {
    if(pnts.length < 2)
      throw "Not enough points";

    this.ctx.lineWidth = busWidth;
    this.ctx.strokeStyle = this.ctx.fillStyle = (active ? BUS_STYLE_ACTIVE : BUS_STYLE);

    this.ctx.beginPath();
    for(let i = 0; i < pnts.length-1; i++)
      this.ctx[i == 0 ? 'moveTo' : 'lineTo'](pnts[i][X]*this.getWidth(), pnts[i][Y]*this.getHeight());

    let p0 = pnts[pnts.length-1];
    const p1 = pnts[pnts.length-2];

    let ang = Math.atan2(p1[Y] - p0[Y], p1[X] - p0[X]);
    p0 = this.rot(p0, ang, ARROW_WIDTH/2, 0);
    this.ctx.lineTo(p0[X], p0[Y]);
    this.ctx.stroke();

    p0[X] /= this.getWidth();
    p0[Y] /= this.getHeight();

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();

    let r;
    this.ctx.moveTo((r = this.rot(p0, ang, 0, -ARROW_WIDTH/2))[X], r[Y]);
    this.ctx.lineTo((r = this.rot(p0, ang, -ARROW_WIDTH/2, 0))[X], r[Y]);
    this.ctx.lineTo((r = this.rot(p0, ang, 0, ARROW_WIDTH/2))[X], r[Y]);
    this.ctx.closePath();
    this.ctx.fill();
    // this.ctx.stroke();
  }

  private rot(origin, ang, x, y){
    let cos = Math.cos(ang);
    let sin = Math.sin(ang);
    let rotX = x*cos - y*sin;
    let rotY = x*sin + y*cos;

    return [ origin[X]*this.getWidth() + rotX, origin[Y]*this.getHeight() + rotY ];
  }
}
