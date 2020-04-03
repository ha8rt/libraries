import { ValidatorFn } from '@angular/forms';
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
   errors: (string[])[] = [];
   change: Subject<ChangeType> = new Subject<ChangeType>();

   keyboard = true;
   ignoreBackdropClick = false;
   closeButton = true;
   classes: string[] = [];

   localTime = true;
   locale: Locales = Locales.hu;

   reqAlert = 'Enter the \"$1\" field.';

   output: Subject<Body> = new Subject<Body>();
   outputObs: Observable<Body> = this.output.asObservable();

   constructor() { }

   set(item: string, value: any) {
      this.body.find((elem) => elem.id === item).value = value;
   }
}
