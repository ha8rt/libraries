import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { AddInvalidControl, InvalidDataType } from '@ha8rt/alert';
import { getFieldValue } from '@ha8rt/table';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, Subject } from 'rxjs';
import { Body, ControlType, IElement, IModalBody } from './body.handler';
import { IModalButton } from './button.handler';
import { ChangeType, IModalHandler } from './modal.handler';

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
      this.reqAlert = handler.reqAlert;
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
      this.changeSub = handler.change.asObservable().subscribe((data: ChangeType) => {
         this.title = data.title ? data.title : this.title;
         this.text = data.text ? data.text : this.text;
         this.reqAlert = data.reqAlert ? data.reqAlert : this.reqAlert;
         if (data.body) { this.setBody(data.body); }
         this.buttons = data.buttons ? data.buttons : this.buttons;
      });
      this.config = {
         keyboard: handler.keyboard,
         ignoreBackdropClick: handler.ignoreBackdropClick,
         class: handler.classes ? handler.classes.join(' ') : null,
      };
      this.closeButton = handler.closeButton;
      this.output = handler.output;
   }
   @Output() button = new EventEmitter<Body>();

   obs: Observable<void>;
   title: string;
   buttons: IModalButton[];
   text: string;
   config: object = {};
   closeButton: boolean;
   localTime: boolean;
   reqAlert: string;
   ControlType = ControlType;
   output: Subject<Body>;

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

   getFieldValue = getFieldValue;

   get inputs() {
      return this.modalForm.get('inputs') as FormArray;
   }

   setBody(body: IModalBody[]) {
      this.inputs.clear();
      this.invalidData = [];
      this.body = [];
      body.forEach((control) => {
         if (control.type === ControlType.date || control.type === ControlType.dateTime) {
            if (!this.localTime) {
               const date: Date = new Date(control.value);
               control.value = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            }
            const dateControl = this.fb.control({ value: control.value, disabled: control.disabled },
               control.required ? Validators.required : null);
            if (control.required) {
               AddInvalidControl(this.invalidData, dateControl, ['required', this.translateField(this.reqAlert, [control.placeHolder])]);
            }
            this.inputs.push(dateControl);
            this.body.push(control);

            if (control.type === ControlType.dateTime) {
               const timeControl = this.fb.control({ value: control.value, disabled: control.disabled },
                  control.required ? Validators.required : null);
               if (control.required) {
                  AddInvalidControl(this.invalidData, timeControl, ['required', this.translateField(this.reqAlert, [control.placeHolder])]);
               }
               this.inputs.push(timeControl);
               this.body.push({
                  id: control.id + 'time', type: ControlType.null, placeHolder: '', value: timeControl.value,
                  required: control.required, disabled: control.disabled, label: '', hidden: false
               });
            }
         } else {
            const formControl = this.fb.control({ value: control.value, disabled: control.disabled },
               control.required ? Validators.required : null);
            this.inputs.push(formControl);
            if (control.required) {
               AddInvalidControl(this.invalidData, formControl, ['required', this.translateField(this.reqAlert, [control.placeHolder])]);
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

   translateField(translate: string, fields: string[]): string {
      if (translate && fields) {
         fields.forEach((value, index) => {
            translate = translate.replace('$' + String(index + 1), value);
         });
      }
      return translate;
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
               if (!body.disabled && !body.hidden && body.type !== ControlType.formInline) {
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

   openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
   }

   onButton(event) {
      const values: IElement[] = [];
      for (const [index, element] of this.body.entries()) {
         if (element.type !== ControlType.null) {
            let value = this.inputs.at(index).value;
            if (value instanceof Date) {
               if (!this.localTime) {
                  value = new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000);
               }
               if (element.type === ControlType.dateTime) {
                  const time = this.inputs.at(index + 1).value as Date;
                  value.setUTCHours(time.getHours());
                  value.setUTCMinutes(time.getMinutes());
                  value.setUTCSeconds(time.getSeconds());
               }
               value = value.toISOString();
            }
            if (element.type === ControlType.number) {
               value = Number(value).valueOf();
            } else if (element.type === ControlType.checkbox) {
               if (element.indeterminate) {
                  value = undefined;
               } else {
                  value = element.value;
               }
            } else if (element.type === ControlType.formInline) {
               value = element.value;
            }
            values.push({ id: element.id, value, disabled: element.disabled });
         }
      }
      this.button.emit(new Body(event.currentTarget.id, values));
      this.output.next(new Body(event.currentTarget.id, values));
      this.modalRef.hide();
   }

   onDblClick(body: IModalBody) {
      if (!body.value || body.value === '0000-01-01') {
         body.value = new Date(Date.now());
      }
   }

   onCheckBox(control: IModalBody) {
      if (control.indeterminate !== undefined) {
         const indeterminate = (!control.value && !control.indeterminate) ? true : false;
         const checked = (!control.value && control.indeterminate) ? true : false;
         control.indeterminate = indeterminate;
         control.value = checked;
      } else {
         control.value = !control.value;
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
