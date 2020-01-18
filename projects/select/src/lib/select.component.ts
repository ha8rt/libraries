import { Component, OnInit, EventEmitter, Input, ViewChild, ElementRef, Output, OnDestroy, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SelectValidators } from './select.validator';
import { getFieldValue } from '@ha8rt/table';
import { ElemList } from './select.handler';

@Component({
   selector: 'lib-select',
   templateUrl: './select.component.html',
   styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit, OnDestroy, OnChanges {
   @ViewChild('select', { static: true }) selectRef: ElementRef;

   // tslint:disable:no-input-rename
   @Input() reset: Observable<void>;
   @Input() load: Observable<number>;
   @Input() unload: Observable<void>;
   @Input() disable: Observable<boolean>;
   @Input('h') header: string;
   @Input() options: string[];
   @Input() field: string;
   @Input('req') required: boolean;
   @Input() elemList: ElemList;
   @Input() myName: string;
   @Input() myGroup: FormGroup;
   @Input() chooseStr: string;

   @Output() changed = new EventEmitter();

   private resetSub: Subscription;
   private loadSub: Subscription;
   private unloadSub: Subscription;
   private disableSub: Subscription;
   control = new FormControl({ value: '', disabled: true });
   loaded = false;

   getFieldValue = getFieldValue;

   constructor() { }

   ngOnInit() {
      this.control.setValue(-1);

      this.elemList.push({ name: this.myName, control: this.control, element: this.selectRef });
      this.myGroup.addControl(this.myName, this.control);

      if (this.reset) {
         this.resetSub = this.reset.subscribe(() => {
            this.control.reset();
            this.control.setValue(-1);
         });
      }
      if (this.load) {
         this.loadSub = this.load.subscribe((value) => {
            this.loaded = true;
            this.control.enable();
            this.control.setValue(this.options && this.options.length === 1 ? 0 : value);
         });
      }
      if (this.unload) {
         this.unloadSub = this.unload.subscribe(() => {
            this.loaded = false;
            this.control.disable();
            this.control.setValue(-1);
         });
      }
      if (this.disable) {
         this.disableSub = this.disable.subscribe((disable) => {
            if (disable) {
               this.control.disable();
            } else {
               this.control.enable();
            }
         });
      }
   }

   ngOnDestroy() {
      if (this.reset) {
         this.resetSub.unsubscribe();
      }
      if (this.load) {
         this.loadSub.unsubscribe();
      }
      if (this.unload) {
         this.unloadSub.unsubscribe();
      }
      if (this.disable) {
         this.disableSub.unsubscribe();
      }
   }

   ngOnChanges() {
      if (this.options && this.options.length === 1) {
         this.control.setValue(0);
      }
      if (this.required) {
         this.control.setValidators(SelectValidators.cannotBeEmpty);
      }
   }

   onChange(value) {
      this.changed.emit(value);
   }
}
