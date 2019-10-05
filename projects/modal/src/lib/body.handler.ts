import { Subject } from 'rxjs';
import { ChangeType } from './modal.handler';

export type ModalBody = IModalBody[];

export interface IModalBody {
   id: string;
   type: string;
   placeHolder: string;
   required: boolean;
   value: any;
   disabled: boolean;
   label: string;
   hidden: boolean;
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
   body?: ModalBody;
}