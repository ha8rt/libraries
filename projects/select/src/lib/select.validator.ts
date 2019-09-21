import { AbstractControl, ValidationErrors } from '@angular/forms';

export class SelectValidators {
   static cannotBeEmpty(control: AbstractControl): ValidationErrors | null {
      if (control.value === null || control.value === -1) {
         return { cannotBeEmpty: true };
      }
      return null;
   }
}
