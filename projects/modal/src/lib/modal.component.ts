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
import { ModalHandler } from './modal.handler';
import { IModalButton } from './button.handler';
import { IModalBody } from './body.handler';

@Component({
   selector: 'lib-modal',
   templateUrl: './modal.component.html',
   styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewChecked, OnDestroy {
   @ViewChild('template', null) template: TemplateRef<any>;

   @Input() set handler(handler: ModalHandler) {
      this.obs = handler.obs;
      this.title = handler.title;
      this.localTime = handler.localTime;
      if (handler.buttons) {
         this.buttons = handler.buttons;
      }
      if (handler.body) {
         this.body = handler.body;
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
            this.body = data.body;
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

   modalBody: IModalBody[];
   set body(body: IModalBody[]) {
      this.inputs.clear();
      this.invalidData = [];
      this.modalBody = [];
      body.forEach((element) => {
         if (element.type === 'date' || element.type === 'dateTime') {
            if (!this.localTime) {
               const date: Date = new Date(element.value);
               element.value = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            }
            const dateControl = this.fb.control({ value: element.value, disabled: element.disabled },
               element.required ? Validators.required : null);
            if (element.required) {
               AddInvalidControl(this.invalidData, dateControl, ['required', 'Adja meg a \"' + element.placeHolder + '\" mezőt.']);
            }
            this.inputs.push(dateControl);
            this.modalBody.push(element);

            if (element.type === 'dateTime') {
               const timeControl = this.fb.control({ value: element.value, disabled: element.disabled },
                  element.required ? Validators.required : null);
               if (element.required) {
                  AddInvalidControl(this.invalidData, timeControl, ['required', 'Adja meg a \"' + element.placeHolder + '\" mezőt.']);
               }
               this.inputs.push(timeControl);
               this.modalBody.push({
                  id: element.id + 'time', type: '', placeHolder: '', value: timeControl.value,
                  required: element.required, disabled: element.disabled, label: '', hidden: false
               });
            }
         } else {
            const control = this.fb.control({ value: element.value, disabled: element.disabled },
               element.required ? Validators.required : null);
            this.inputs.push(control);
            if (element.required) {
               AddInvalidControl(this.invalidData, control, ['required', 'Adja meg a \"' + element.placeHolder + '\" mezőt.']);
            }
            this.modalBody.push(element);
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

   constructor(private modalService: BsModalService, private localeService: BsLocaleService, private fb: FormBuilder) {
      this.localeService.use('hu');
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
         if (this.modalBody && this.modalBody.length > 0 &&
            this.modalBody.some((elem) => document.getElementById(elem.id) !== null)) {
            for (const body of this.modalBody) {
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
      for (const [index, element] of this.modalBody.entries()) {
         if (element.type !== '') {
            let value = this.inputs.at(index).value;
            if (value instanceof Date) {
               if (!this.localTime) {
                  value = new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000);
               }
               if (element.type === 'dateTime') {
                  const time = this.inputs.at(index + 1).value as Date;
                  value.setUTCHours(time.getHours());
                  value.setUTCMinutes(time.getMinutes());
                  value.setUTCSeconds(time.getSeconds());
               }
               value = value.toISOString();
            }
            if (element.type === 'number') {
               value = Number(value).valueOf();
            }
            values.push({ id: element.id, value, disabled: element.disabled });
         }
      }
      this.button.emit(new Body(event.currentTarget.id, values));
      this.modalRef.hide();
   }

   onDblClick(modalBody: IModalBody) {
      if (!modalBody.value || modalBody.value === '0000-01-01') {
         modalBody.value = new Date(Date.now());
      }
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
