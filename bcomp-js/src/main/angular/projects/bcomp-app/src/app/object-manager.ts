import { ElementRef } from "@angular/core";

class GUIObject {
  private x: number;
  private y: number;
  private w: number;
  private h: number;

  public constructor(private parent: HTMLElement, private element: HTMLElement){
  }

  public update(){
    let selfBR = this.element.getBoundingClientRect();
    let parentBR = this.parent.getBoundingClientRect();

    this.x = (selfBR.left - parentBR.left) / parentBR.width;
    this.y = (selfBR.top - parentBR.top) / parentBR.height;
    this.w = selfBR.width / parentBR.width;
    this.h = selfBR.height / parentBR.height;
  }

  public get top() : number {
    return this.y;
  }

  public get bottom() : number {
    return this.y + this.h;
  }

  public get vCenter() : number {
    return this.y + this.h/2;
  }

  public get left() : number {
    return this.x;
  }

  public get right() : number {
    return this.x + this.w;
  }

  public get hCenter() : number {
    return this.x + this.w/2;
  }

  public get width() : number {
    return this.w;
  }

  public get height() : number {
    return this.h;
  }
}

export class GUIObjectManager {
  private elements = {};

  constructor(private parent: ElementRef) {
  }

  public add(name: string, elRef: ElementRef): void {
    this.elements[name] = new GUIObject(this.parent.nativeElement, elRef.nativeElement);
  }

  public get(name: string): GUIObject {
    this.elements[name].update();
    return this.elements[name];
  }
}
