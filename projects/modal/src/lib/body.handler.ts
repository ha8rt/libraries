import { ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { ChangeType } from './modal.handler';

export interface IElement {
   id: string;
   value: any;
   disabled?: boolean;
}

export type IBodyType = (string | IElement[])[];

export class Body {
   private value: IBodyType;

   constructor(key: string, values: IElement[]) {
      this.value = [key, values];
   }

   getKey(): string {
      return this.value[0] as string;
   }

   getField(field: string): any {
      const element = (this.value[1] as IElement[]).find((value) => value.id === field);
      return element ? element.value : undefined;
   }

   getId(): any {
      const element = (this.value[1] as IElement[]).find((value) => value.id.split('-').reverse()[0] === 'id');
      return element ? element.value : undefined;
   }

   getPatchValues(): { [key: string]: any } {
      const obj: { [key: string]: any } = {};
      (this.value[1] as IElement[]).forEach(element => {
         if (!element.disabled) {
            obj[element.id.split('-').reverse()[0]] = element.value;
         }
      });
      return obj;
   }

   getElement(id: string): IElement | undefined {
      return (this.value[1] as IElement[]).find((value) => value.id === id);
   }
}

export interface IModalBody {
   id: string;
   type: ControlType;
   placeHolder?: string;
   required?: boolean;
   value?: any;
   disabled?: boolean;
   label?: string;
   hidden?: boolean;
   indeterminate?: boolean;
   field?: string;
   options?: any;
   default?: string;
   validators?: ValidatorFn[];
   errors?: (string[])[];
}

export enum ControlType {
   text = 'text',
   password = 'password',
   number = 'number',
   date = 'date',
   dateTime = 'dateTime',
   dateRange = 'dateRange',
   select = 'select',
   textarea = 'textarea',
   formInline = 'form-inline',
   checkbox = 'checkbox',
   null = 'null',
}

export enum BodyType {
   Login,
   ChgPwd,
   AddCodeName,
   EditIdCodeName,
   DeleteIdCodeName,
   AddTypeCodeName,
   EditTypeIdCodeName,
   DeleteTypeIdCodeName,
   AddContestCodeName,
   EditContestIdCodeName,
   DeleteContestIdCodeName,
   EditIdCodeNameStartFinish,
   EditSentReceivedData,
   OrderNumber,
   OrderSubmitDetails,
   Date,
   AddClientComment,
   SupplierComment,
   SupplierEditClientComment,
   SupplierShowClientComment,
   ShowClientComment,
   HiddenOrderNumber,
   SearchCommentOrderDate,
}

export interface InitBodyObj {
   type: BodyType;
   event?: Subject<ChangeType>[];
   title?: string;
   row?: any;
   body?: IModalBody[];
}
