import { Component, OnInit, EventEmitter, Input, ViewChild, ElementRef, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectValidators } from './select.validator';
import { getFieldValue } from '@ha8rt/table';
import { ElemList } from './select.handler';

@Component({
   selector: 'lib-select',
   templateUrl: './select.component.html',
   styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit, OnDestroy {
   @ViewChild('select', { static: true }) selectRef: ElementRef;

   // tslint:disable:no-input-rename
   @Input() reset: Observable<void>;
   @Input() load: Observable<void>;
   @Input() unload: Observable<void>;
   @Input('h') header: string;
   @Input() options: string[];
   @Input() field: string;
   @Input('req') required: boolean;
   @Input() elemList: ElemList;
   @Input() myName: string;
   @Input() myGroup: FormGroup;
   @Input() chooseStr: string;

   @Output() changed = new EventEmitter();

   private resetVal;
   private loadVal;
   private unloadVal;
   control = new FormControl({ value: '', disabled: true });
   loaded = false;

   getFieldValue = getFieldValue;

   constructor() { }

   ngOnInit() {
      this.control.setValue(-1);

      this.elemList.push({ name: this.myName, control: this.control, element: this.selectRef });
      this.myGroup.addControl(this.myName, this.control);

      if (this.reset) {
         this.resetVal = this.reset.subscribe(() => {
            this.control.reset();
            this.control.setValue(-1);
         });
      }
      if (this.load) {
         this.loadVal = this.load.subscribe(() => {
            this.loaded = true;
            this.control.enable();
            this.control.setValue(-1);
         });
      }
      if (this.unload) {
         this.unloadVal = this.unload.subscribe(() => {
            this.loaded = false;
            this.control.disable();
            this.control.setValue(-1);
         });
      }
      if (this.required) {
         this.control.setValidators(SelectValidators.cannotBeEmpty);
      }
   }

   ngOnDestroy() {
      if (this.reset) {
         this.resetVal.unsubscribe();
      }
      if (this.load) {
         this.loadVal.unsubscribe();
      }
      if (this.unload) {
         this.unloadVal.unsubscribe();
      }
   }

   onChange(value) {
      this.changed.emit(value);
   }
}
