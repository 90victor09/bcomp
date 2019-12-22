import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(value: string, group: number = 4): string {
    let tmp : string[] = value.split("");

    for(let i = value.length - group; i > 0; i -= group)
      tmp.splice(i, 0, " ");

    return tmp.join("");
  }

}
