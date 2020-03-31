import { InitButtonObj, ButtonType, IModalButton } from './button.handler';

export function AddModalButton(modalButton: IModalButton[],
   // tslint:disable-next-line: align
   id: string, value: string, classes: string, type: string, checkInvalid?: boolean) {
   modalButton.push({ id, value, classes, type, checkInvalid });
}

export function InitButton(obj: InitButtonObj, count: number): IModalButton[][] {
   obj.button = [];
   switch (obj.type) {
      case ButtonType.Login: {
         AddModalButton(obj.button, obj.prefix + '-submit', 'Login', 'btn-success btn-block', 'submit', true);
         break;
      }
      case ButtonType.Ok: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'OK', 'btn-primary', 'submit');
         break;
      }
      case ButtonType.OkCancel: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'OK', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
      case ButtonType.YesCancel: {
         AddModalButton(obj.button, obj.prefix + '-yes', 'Yes', 'btn-primary', 'submit');
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
      case ButtonType.CancelOk: {
         AddModalButton(obj.button, obj.prefix + '-ok', 'OK', 'btn-primary', 'button', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'submit');
         break;
      }
      case ButtonType.CancelYes: {
         AddModalButton(obj.button, obj.prefix + '-yes', 'Yes', 'btn-primary', 'button');
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'submit');
         break;
      }
      case ButtonType.SendCancel: {
         AddModalButton(obj.button, obj.prefix + '-send', 'Send', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
      case ButtonType.ListCancel: {
         AddModalButton(obj.button, obj.prefix + '-create', 'Create list', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
      case ButtonType.CancelDelete: {
         AddModalButton(obj.button, obj.prefix + '-delete', 'Delete', 'btn-primary', 'submit');
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
      case ButtonType.RemoveFilterOkCancel: {
         AddModalButton(obj.button, obj.prefix + '-remove-filter', 'Remove filter', 'btn-light left', 'button');
         AddModalButton(obj.button, obj.prefix + '-ok', 'OK', 'btn-primary', 'submit', true);
         AddModalButton(obj.button, obj.prefix + '-cancel', 'Cancel', 'btn-light', 'button');
         break;
      }
   }
   return new Array(count).fill(obj.button);
}
