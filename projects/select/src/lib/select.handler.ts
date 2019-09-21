import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

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
