
export function* values(Enum: object){
  for(let key of Object.keys(Enum)){
    if(!isNaN(Number(key)))
      yield key;
  }
}

export function hex(hex: string) : number {
  return Number("0x" + hex);
}

export function setBit(value: number, shift: number, bit: boolean) : number {
  return (bit ? (value | (1 << shift)) : (value & ~(1 << shift)));
}
