import {
   Component, OnInit, TemplateRef, Input, Output,
   EventEmitter, ViewChild, AfterViewChecked, OnDestroy
} from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

import { FormBuilder, FormArray, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { InvalidDataType, AddInvalidControl } from '@ha8rt/alert';
import { Body, IElement } from '@ha8rt/http.service';
import { IModalHandler } from './modal.handler';
import { IModalButton } from './button.handler';
import { IModalBody, ControlType } from './body.handler';
import { Locales } from './locale.module';

@Component({
   selector: 'lib-modal',
   templateUrl: './modal.component.html',
   styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewChecked, OnDestroy {
   constructor(private modalService: BsModalService, private localeService: BsLocaleService, private fb: FormBuilder) { }

   @ViewChild('template', null) template: TemplateRef<any>;

   @Input() set handler(handler: IModalHandler) {
      this.obs = handler.obs;
      this.title = handler.title;
      this.localTime = handler.localTime;
      this.localeService.use(handler.locale);
      if (handler.buttons) {
         this.buttons = handler.buttons;
      }
      if (handler.body) {
         this.setBody(handler.body);
      }
      if (handler.validators) {
         this.validators = handler.validators;
      }
      this.text = handler.text;
      if (handler.errors) {
         this.errors = handler.errors;
      }
      this.changeSub = handler.change.asObservable().subscribe((data) => {
         if (data.title) {
            this.title = data.title;
         }
         if (data.text) {
            this.text = data.text;
         }
         if (data.body) {
            this.setBody(data.body);
         }
      });
      this.config = {
         keyboard: handler.keyboard,
         ignoreBackdropClick: handler.ignoreBackdropClick,
         class: handler.classes ? handler.classes.join(' ') : null,
      };
      this.closeButton = handler.closeButton;
   }
   @Output() button = new EventEmitter<Body>();

   obs: Observable<void>;
   title: string;
   buttons: IModalButton[];
   text: string;
   config: object = {};
   closeButton: boolean;
   localTime: boolean;
   locale: Locales;
   type = ControlType;

   body: IModalBody[];

   modalForm = this.fb.group({
      inputs: this.fb.array([])
   });

   modalRef: BsModalRef;
   showSub: Subscription;
   changeSub: Subscription;
   invalidData: InvalidDataType = [];

   checkFocus = false;
   shown: boolean;

   bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
      containerClass: 'theme-dark-blue', isAnimated: true, dateInputFormat: 'YYYY-MM-DD'
   });

   setBody(body: IModalBody[]) {
      this.inputs.clear();
      this.invalidData = [];
      this.body = [];
      body.forEach((control) => {
         if (control.type === this.type.date || control.type === this.type.dateTime) {
            if (!this.localTime) {
               const date: Date = new Date(control.value);
               control.value = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            }
            const dateControl = this.fb.control({ value: control.value, disabled: control.disabled },
               control.required ? Validators.required : null);
            if (control.required) {
               AddInvalidControl(this.invalidData, dateControl, ['required', 'Adja meg a \"' + control.placeHolder + '\" mezőt.']);
            }
            this.inputs.push(dateControl);
            this.body.push(control);

            if (control.type === this.type.dateTime) {
               const timeControl = this.fb.control({ value: control.value, disabled: control.disabled },
                  control.required ? Validators.required : null);
               if (control.required) {
                  AddInvalidControl(this.invalidData, timeControl, ['required', 'Adja meg a \"' + control.placeHolder + '\" mezőt.']);
               }
               this.inputs.push(timeControl);
               this.body.push({
                  id: control.id + 'time', type: this.type.null, placeHolder: '', value: timeControl.value,
                  required: control.required, disabled: control.disabled, label: '', hidden: false
               });
            }
         } else {
            const formControl = this.fb.control({ value: control.value, disabled: control.disabled },
               control.required ? Validators.required : null);
            this.inputs.push(formControl);
            if (control.required) {
               AddInvalidControl(this.invalidData, formControl, ['required', 'Adja meg a \"' + control.placeHolder + '\" mezőt.']);
            }
            this.body.push(control);
         }
      });
   }
   set validators(validators: ValidatorFn[]) {
      this.inputs.setValidators(validators);
   }
   set errors(errors: (string[])[]) {
      errors.forEach(error => {
         AddInvalidControl(this.invalidData, this.inputs, error);
      });
   }

   ngOnInit(): void {
      this.showSub = this.obs.subscribe(() => {
         if (!this.shown) {
            this.shown = true;
            this.openModal(this.template);
         }
      });
      this.modalService.onShown.subscribe(() => {
         this.checkFocus = true;
         this.inputs.controls.forEach(element => {
            element.reset();
         });
      });
      this.modalService.onHidden.subscribe(() => {
         this.shown = false;
      });
   }

   ngOnDestroy(): void {
      this.showSub.unsubscribe();
      this.changeSub.unsubscribe();
   }

   ngAfterViewChecked(): void {
      if (this.checkFocus && this.shown) {
         if (this.body && this.body.length > 0 &&
            this.body.some((elem) => document.getElementById(elem.id) !== null)) {
            for (const body of this.body) {
               if (!body.disabled && !body.hidden) {
                  document.getElementById(body.id).focus();
                  this.checkFocus = false;
                  return;
               }
            }
         }
         if (this.buttons && this.buttons.length > 0 && document.getElementById(this.buttons[0].id) != null) {
            for (const button of this.buttons) {
               if (button.type === 'submit') {
                  document.getElementById(button.id).focus();
                  this.checkFocus = false;
               }
            }
         }
      }
   }

   get inputs() {
      return this.modalForm.get('inputs') as FormArray;
   }

   openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
   }

   onButton(event) {
      const values: IElement[] = [];
      for (const [index, element] of this.body.entries()) {
         if (element.type !== this.type.null) {
            let value = this.inputs.at(index).value;
            if (value instanceof Date) {
               if (!this.localTime) {
                  value = new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000);
               }
               if (element.type === this.type.dateTime) {
                  const time = this.inputs.at(index + 1).value as Date;
                  value.setUTCHours(time.getHours());
                  value.setUTCMinutes(time.getMinutes());
                  value.setUTCSeconds(time.getSeconds());
               }
               value = value.toISOString();
            }
            if (element.type === this.type.number) {
               value = Number(value).valueOf();
            }
            if (element.type === ControlType.checkbox && element.indeterminated) {
               value = undefined;
            }
            values.push({ id: element.id, value, disabled: element.disabled });
         }
      }
      this.button.emit(new Body(event.currentTarget.id, values));
      this.modalRef.hide();
   }

   onDblClick(body: IModalBody) {
      if (!body.value || body.value === '0000-01-01') {
         body.value = new Date(Date.now());
      }
   }

   onCheckBox(control: IModalBody) {
      const indeterminated = (!control.value && !control.indeterminated) ? true : false;
      const checked = (!control.value && control.indeterminated) ? true : false;
      control.indeterminated = indeterminated;
      control.value = checked;
   }

   isInvalid(): boolean {
      let invalid = false;
      if (this.inputs.errors && (this.inputs.errors.DoNotMatchNew || this.inputs.errors.MatchOld)) {
         invalid = true;
      } else {
         this.inputs.controls.forEach(element => {
            if (element.invalid && (element.touched || element.dirty)) {
               invalid = true;
            }
         });
      }
      return invalid;
   }
}
