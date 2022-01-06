import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressShrink',
  pure: false
})
export class AddressShrinkPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value ? `${value.slice(0, 6)}...${value.slice(value.length - 4, value.length)}` : null;
  }
}
