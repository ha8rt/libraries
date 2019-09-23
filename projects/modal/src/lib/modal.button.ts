export type ModalButton = IModalButton[];

export interface IModalButton {
   id: string;
   value: string;
   classes: string;
   type: string;
   checkInvalid: boolean;
}

export function AddModalButton(modalButton: ModalButton,
   // tslint:disable-next-line: align
   id: string, value: string, classes: string, type: string, checkInvalid?: boolean) {
   modalButton.push({ id, value, classes, type, checkInvalid });
}

export enum ButtonType {
   Login,
   Ok,
   OkCancel,
   YesCancel,
   CancelOk,
   SendCancel,
   ListCancel,
   CancelDelete,
}

export interface InitButtonObj {
   type: ButtonType;
   prefix: string;
   button?: ModalButton;
}

export function InitButton(obj: InitButtonObj, count: number): ModalButton[] {
   obj.button = [];
   switch (obj.type) {
      case ButtonType.Login: {
         AddModalButton(obj.button, obj.prefix + '-submit', 'Bejelentkezés', 'btn-success btn-block', 'submit', true);
         break;
      }
      case ButtonType.Ok: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'Rendben', 'btn-primary', 'submit');
         break;
      }
      case ButtonType.OkCancel: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'Rendben', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'button');
         break;
      }
      case ButtonType.YesCancel: {
         AddModalButton(obj.button, obj.prefix + '-yes', 'Igen', 'btn-primary', 'submit');
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'button');
         break;
      }
      case ButtonType.CancelOk: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'Rendben', 'btn-primary', 'button', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'submit');
         break;
      }
      case ButtonType.SendCancel: {
         AddModalButton(obj.button, obj.prefix + '-send', 'Küldés', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'button');
         break;
      }
      case ButtonType.ListCancel: {
         AddModalButton(obj.button, obj.prefix + '-create', 'Lista készítése', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'button');
         break;
      }
      case ButtonType.CancelDelete: {
         AddModalButton(obj.button, obj.prefix + '-delete', 'Törlés', 'btn-primary', 'submit');
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Mégse', 'btn-light', 'button');
         break;
      }
   }
   return new Array(count).fill(obj.button);
}
