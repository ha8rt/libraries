import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getFieldValue } from '@ha8rt/table';
import { Observable, Subscription } from 'rxjs';
import { ElemList } from './select.handler';
import { SelectValidators } from './select.validator';

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
   @Input() header: string;
   @Input() options: string[];
   @Input() field: string;
   @Input() required: boolean;
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
            // console.log("RESET" + this.myName);
            this.control.setValue(-1);
         });
      }
      if (this.load) {
         this.loadSub = this.load.subscribe((value) => {
            this.loaded = true;
            this.control.enable();
            if (!this.setFirstIfPossible()) {
               // console.log("LOAD" + this.myName, value || this.control.value);
               this.control.setValue(value || this.control.value);
            }
         });
      }
      if (this.unload) {
         this.unloadSub = this.unload.subscribe(() => {
            this.loaded = false;
            this.control.disable();
            // console.log("UNLOAD" + this.myName);
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
      this.elemList.splice(this.elemList.findIndex((elem) => elem.name === this.myName), 1);
      this.myGroup.removeControl(this.myName);
      if (this.reset) { this.resetSub.unsubscribe(); }
      if (this.load) { this.loadSub.unsubscribe(); }
      if (this.unload) { this.unloadSub.unsubscribe(); }
      if (this.disable) { this.disableSub.unsubscribe(); }
   }

   ngOnChanges() {
      this.setFirstIfPossible();
      if (this.required) {
         this.control.setValidators(SelectValidators.cannotBeEmpty);
      }
   }

   onChange(value) {
      // console.log("CHANGE:" + this.myName + value);
      this.changed.emit(value);
   }

   setFirstIfPossible(): boolean {
      if (this.options && this.options.length === 1 && this.control.value !== 0) {
         // console.log("SET FIRST", this.options);
         const value = (this.options[0] as any)._id || 0;
         this.control.setValue(value);
         this.onChange(value);
         return true;
      }
      return false;
   }
}
