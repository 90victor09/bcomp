
export function* values(Enum: object){
  for(let key of Object.keys(Enum)){
    if(!isNaN(Number(key)))
      yield key;
  }
}

let digits = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

export function hex(hex: string) : number {
  return Number("0x" + hex);
}

export function toHex(num: number, width?: number) : string {
  if(width == undefined){
    width = 1;
    while((num >> width*4) > 0)
      width++;
  }
  let str : string = "";
  for(let i = 0; i < width*4; i += 4)
    str = digits[((num >> i) & 0xF)] + str;
  return str;
}

export function setBit(value: number, shift: number, bit: boolean) : number {
  return (bit ? (value | (1 << shift)) : (value & ~(1 << shift)));
}
