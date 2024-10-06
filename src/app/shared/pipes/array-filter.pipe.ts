import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrFilter',
  standalone: true,
})
export class ArrayFilterPipe implements PipeTransform {
  transform(value: any[] | null, searchTerm: string | null): any[] | null {
    if (!searchTerm || !value) {
      return value;
    }

    const result = value.filter((v) =>
      v.toString().toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );

    return result?.length ? result : null;
  }
}
