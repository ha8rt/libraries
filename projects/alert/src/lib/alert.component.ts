import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { InvalidDataType } from './alert.validator';

@Component({
   selector: 'lib-alert',
   templateUrl: './alert.component.html',
   styleUrls: ['./alert.component.css']
})
export class AlertComponent {
   @Input() data: InvalidDataType = [];

   constructor() { }

   getShown = () => this.data.some((control) => {
      const element = control[0] as AbstractControl;
      console.log(element);
      const invalid = element.invalid && element.touched;
      return invalid && element.errors && (control[1] as string[][]).some((error) => element.errors[error[0]]);
   })
}
