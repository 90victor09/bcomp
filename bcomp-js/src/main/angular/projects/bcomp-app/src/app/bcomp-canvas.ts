
type Vec = { [n: number]: number }; //[number. number];

const X = 0;
const Y = 1;

const ALU_BACKGROUND_STYLE = "rgb(157, 189, 165)";
const ALU_BORDER_STYLE = "rgb(0,0,0)";
const ALU_BORDER_WIDTH = 1;


const BUS_WIDTH = 10;
const BUS_STYLE = "rgb(128, 128, 128)";
const BUS_STYLE_ACTIVE = "#F00";

const ARROW_WIDTH = 15;

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

  drawALU(x, y, width, height) : void {
    this.ctx.translate(x, y);
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
    this.ctx.font = '45px serif';
    this.ctx.fillText('ALU', width/2 - this.ctx.measureText("ALU").width/2, height-5);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }



  drawBus(pnts: Vec[], active: boolean) : void {
    if(pnts.length < 2)
      throw "Not enough points";

    this.ctx.lineWidth = BUS_WIDTH;
    this.ctx.strokeStyle = this.ctx.fillStyle = (active ? BUS_STYLE_ACTIVE : BUS_STYLE);

    this.ctx.beginPath();
    for(let i = 0; i < pnts.length-1; i++)
      this.ctx[i == 0 ? 'moveTo' : 'lineTo'](pnts[i][X], pnts[i][Y]);

    const p0 = pnts[pnts.length-1];
    const p1 = pnts[pnts.length-2];
    const p2 = (pnts.length-3 < 0 ? [1, 0] : pnts[pnts.length-3]);

    function cosAng(a: Vec, b: Vec) : number {
      return (a[X] * b[X] + a[Y] * b[Y]) / (Math.hypot(a[X], a[Y]) * Math.hypot(b[X], b[Y]));
    }
    const cos = cosAng(
      [p1[X] - p2[X], p1[Y] - p2[Y]],
      [p0[X] - p1[X], p0[Y] - p1[Y]]
    );
    const sin = Math.sqrt(1 - cos*cos);

    const cw = cos*ARROW_WIDTH;
    const sw = sin*ARROW_WIDTH;
    const chw = cw/2, shw = sw/2;

    this.ctx.lineTo(p0[X] = p0[X] - sw, p0[Y] = p0[Y] + cw);
    this.ctx.stroke();



    this.ctx.beginPath();
    this.ctx.moveTo(p0[X] - chw,p0[Y] - shw);
    this.ctx.lineTo(p0[X] + sw, p0[Y] - cw);
    this.ctx.lineTo(p0[X] + chw,p0[Y] + shw);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
