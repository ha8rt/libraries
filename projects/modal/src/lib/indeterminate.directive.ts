import { Directive, ElementRef, Input } from '@angular/core';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[indeterminate]' })
export class IndeterminateDirective {
   @Input()
   set indeterminate(value) {
      this.elem.nativeElement.indeterminate = value;
   }
   constructor(private elem: ElementRef) {
   }
}
