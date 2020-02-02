// No polyfills for generators(
export function values(Enum: object){
  let values = [];
  for(let key of Object.keys(Enum)){
    if(!isNaN(Number(key)))
      values.push(key);
  }
  return values;
}

let digits = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

export function hex(hex: string) : number {
  return Number("0x" + hex);
}

export function toHex(num: number, width?: number) : string {
  let hex = Number(num).toString(16).toUpperCase();
  if(width < hex.length)
    hex = hex.substring(0, width);
  else if(width > hex.length)
    hex = "0".repeat(width - hex.length) + hex;
  return hex;
}

export function setBit(value: number, shift: number, bit: boolean) : number {
  return (bit ? (value | (1 << shift)) : (value & ~(1 << shift)));
}


export function bitwiseAND(a: number, b: number) : number {
  const as = Number(a).toString(2);
  const bs = Number(b).toString(2);
  const len = Math.max(as.length, bs.length);

  let result = "0".repeat(len);
  for(let i = 1; i <= len; i++){
    if(as[as.length - i] == "1" && bs[bs.length - i] == "1")
      result = result.substring(0, len - i) + "1" + result.substring(len - i + 1);
  }

  return Number(result);
}
