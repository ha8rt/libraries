import { Subject, Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';
import { Locales } from './locale.module';
import { IModalBody } from './body.handler';
import { IModalButton } from './button.handler';

export interface ChangeType {
   title?: string;
   text?: string;
   body?: IModalBody[];
   buttons?: IModalButton[];
   reqAlert?: string;
}

export interface IModalHandler {
   event: Subject<void>;
   obs: Observable<void>;
   title: string;
   body: IModalBody[];
   buttons: IModalButton[];
   text: string;
   validators: ValidatorFn[];
   errors: (string[])[];
   change: Subject<ChangeType>;

   keyboard: boolean;
   ignoreBackdropClick: boolean;
   closeButton: boolean;
   classes: string[];

   localTime: boolean;
   locale: Locales;

   reqAlert: string;
}

export function initModal(): IModalHandler {
   const event = new Subject<void>();
   const obs = event.asObservable();
   const title = '';
   const body = [];
   const buttons = [];
   const text = '';
   const validators = [];
   const errors = [];
   const change = new Subject();

   const keyboard = true;
   const ignoreBackdropClick = false;
   const closeButton = true;
   const classes = [];

   const localTime = true;
   const locale = Locales.hu;
   const reqAlert = 'Enter the \"$1\" field.';

   const handler: IModalHandler = {
      event, obs, title, body, buttons, text, validators, errors, change,
      keyboard, ignoreBackdropClick, closeButton, classes,
      localTime, locale, reqAlert
   };

   return handler;
}
