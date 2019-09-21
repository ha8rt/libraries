import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getFieldValue } from '@ha8rt/table';

export type ElemList = IElem[];

export interface IElem {
   name: string;
   control: FormControl;
   element: ElementRef<any>;
}

export function getControl(elemList: ElemList, name: string): FormControl {
   return elemList.find((value) => value.name === name).control;
}

export function getElement(elemList: ElemList, name: string): ElementRef<any> {
   return elemList.find((value) => value.name === name).element;
}

export function getNative(elemList: ElemList, name: string) {
   return getElement(elemList, name).nativeElement;
}

export function getInvalid(elemList: ElemList): boolean {
   let invalid = false;
   elemList.forEach(elem => {
      if (elem.control.invalid && elem.control.touched) {
         invalid = true;
      }
   });
   return invalid;
}

export function getValue(elemList: ElemList, name: string, rows: any[], code: string): any {
   return getFieldValue(rows[getControl(elemList, name).value], code);
}

export function getIndexOfRow(rows: any[], row: any, code: string) {
   return rows.findIndex((value) => getFieldValue(value, code) === getFieldValue(row, code));
}
