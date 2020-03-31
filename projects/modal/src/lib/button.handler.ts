export interface IModalButton {
   id: string;
   value: string;
   classes: string;
   type: string;
   checkInvalid: boolean;
}

export enum ButtonType {
   Login,
   Ok,
   OkCancel,
   YesCancel,
   CancelOk,
   CancelYes,
   SendCancel,
   ListCancel,
   CancelDelete,
   RemoveFilterOkCancel,
}

export interface InitButtonObj {
   type: ButtonType;
   prefix: string;
   button?: IModalButton[];
}
