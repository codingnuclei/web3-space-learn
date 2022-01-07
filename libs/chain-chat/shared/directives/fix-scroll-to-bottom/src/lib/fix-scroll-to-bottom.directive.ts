import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[myWeb3FixScrollToBottom]'
})
export class FixScrollToBottomDirective {
  @Input()
  set myWeb3FixScrollToBottom(val: any) {
    setTimeout(() => {
      const xH = this.elementRef.nativeElement.scrollHeight;
      this.elementRef.nativeElement.scrollTo(0, xH);
    }, 0);
  }

  constructor(private elementRef: ElementRef) {}
}
