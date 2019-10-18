import { Subject } from 'rxjs';
import { ChangeType } from './modal.handler';

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
}

export enum ControlType {
   text = 'text',
   password = 'password',
   number = 'number',
   date = 'date',
   dateTime = 'dateTime',
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
