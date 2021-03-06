import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { Observable, Subject } from 'rxjs';
import { Body, IModalBody } from './body.handler';
import { IModalButton } from './button.handler';
import { Locales } from './locale.module';

export interface ChangeType {
   title?: string;
   text?: string;
   body?: IModalBody[];
   buttons?: IModalButton[];
   reqAlert?: string;
   validators?: ValidatorFn[];
   asyncValidators?: AsyncValidatorFn[];
   errors?: (string[])[];
}

export class ModalHandler implements ChangeType {
   event: Subject<void> = new Subject<void>();
   obs: Observable<void> = this.event.asObservable();
   title: string;
   body: IModalBody[] = [];
   buttons: IModalButton[] = [];
   text: string;
   validators: ValidatorFn[] = [];
   asyncValidators: AsyncValidatorFn[] = [];
   errors: (string[])[] = [];
   change: Subject<ChangeType> = new Subject<ChangeType>();

   keyboard = true;
   ignoreBackdropClick = false;
   closeButton = true;
   classes: string[] = [];

   localTime = true;
   locale: Locales;

   bsConfig: Partial<BsDatepickerConfig> = {
      containerClass: 'theme-dark-blue', isAnimated: true, dateInputFormat: 'YYYY-MM-DD',
   };

   reqAlert = 'Enter the \"$1\" field.';

   output: Subject<Body> = new Subject<Body>();
   outputObs: Observable<Body> = this.output.asObservable();

   constructor() { }

   set(item: string, value: any) {
      // todo datetime nem működik
      this.body.find((elem) => elem.id === item).value = value;
   }
}
