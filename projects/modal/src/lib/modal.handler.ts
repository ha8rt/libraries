import { Subject } from 'rxjs';
import { ModalButton } from './modal.button';
import { ModalBody } from './modal.body';
import { ValidatorFn } from '@angular/forms';

export interface ChangeType {
   title?: string;
   text?: string;
   body?: ModalBody;
}

export class ModalHandler {
   event: Subject<void> = new Subject<void>();
   obs = this.event.asObservable();
   title: string;
   body: ModalBody = [];
   buttons: ModalButton = [];
   text: string;
   validators: ValidatorFn[];
   errors: (string[])[];
   change: Subject<ChangeType>;

   constructor(title: string, text?: string, validators?: ValidatorFn[], errors?: (string[])[]) {
      this.title = title;
      this.text = text;
      this.validators = validators;
      this.errors = errors;
      this.change = new Subject();
   }

}
