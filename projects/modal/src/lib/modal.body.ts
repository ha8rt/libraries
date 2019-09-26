import { ModalBody, InitBodyObj, BodyType } from './body.handler';
import { getTitle } from './modal.title';

// tslint:disable: align
export function AddModalBody(modalBody: ModalBody,
   id: string, type: string, placeHolder: string, label?: string,
   required?: boolean, value?: string, disabled?: boolean, hidden?: boolean
) {
   modalBody.push({ id, type, placeHolder, value, required, disabled, label, hidden });
}

export function InitBody(obj: InitBodyObj, count?: number): ModalBody[] {
   if (!obj.body) {
      obj.body = [];
   }
   switch (obj.type) {
      case BodyType.Login: {
         AddModalBody(obj.body, 'username', 'text', 'Felhasználónév', 'Felhasználónév', true);
         AddModalBody(obj.body, 'current-password', 'password', 'Jelszó', 'Jelszó', true);
         break;
      }
      case BodyType.ChgPwd: {
         AddModalBody(obj.body, 'username', 'text', 'Felhasználónév', 'Felhasználónév', true);
         AddModalBody(obj.body, 'current-password', 'password', 'Régi jelszó', 'Régi jelszó', true);
         AddModalBody(obj.body, 'new-password', 'password', 'Új jelszó', 'Új jelszó', true);
         AddModalBody(obj.body, 'new-password-again', 'password', 'Új jelszó megint', '', true);
         break;
      }
      case BodyType.AddContestCodeName: {
         AddModalBody(obj.body, 'add-contest', 'text', 'Verseny', obj.title + ' versenye', true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.AddCodeName, title: obj.title });
         break;
      }
      case BodyType.AddTypeCodeName: {
         AddModalBody(obj.body, 'add-type', 'text', 'Típus', obj.title + ' típus', true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.AddCodeName, title: obj.title });
         break;
      }
      case BodyType.AddCodeName: {
         AddModalBody(obj.body, 'add-code', 'text', 'Kód', obj.title + ' kód', true);
         AddModalBody(obj.body, 'add-name', 'text', 'Név', obj.title + ' neve', true);
         break;
      }
      case BodyType.EditContestIdCodeName: {
         AddModalBody(obj.body, 'edit-contest', 'text', 'Verseny', obj.title + ' versenye', false, obj.row.contest._id, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.EditIdCodeName, title: obj.title, row: obj.row });
         break;
      }
      case BodyType.EditTypeIdCodeName: {
         AddModalBody(obj.body, 'edit-type', 'text', 'Típus', obj.title + ' típus', false, obj.row.type._id, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.EditIdCodeName, title: obj.title, row: obj.row });
         break;
      }
      case BodyType.EditIdCodeName: {
         AddModalBody(obj.body, 'edit-id', 'text', '', obj.title + ' azonosító', false, obj.row._id, true);
         AddModalBody(obj.body, 'edit-code', 'text', 'Kód', obj.title + ' kód', true, obj.row.code);
         AddModalBody(obj.body, 'edit-name', 'text', 'Név', obj.title + ' neve', true, obj.row.name);
         break;
      }
      case BodyType.EditIdCodeNameStartFinish: {
         [obj.body] = InitBody({ body: obj.body, type: BodyType.EditIdCodeName, title: obj.title, row: obj.row });
         AddModalBody(obj.body, 'edit-start', 'dateTime', 'Kezdete', obj.title + ' kezdete (dátum, óra, perc, mp)', true, obj.row.start);
         AddModalBody(obj.body, 'edit-finish', 'dateTime', 'Vége', obj.title + ' vége (dátum, óra, perc, mp)', true, obj.row.finish);
         break;
      }
      case BodyType.EditSentReceivedData: {
         AddModalBody(obj.body, 'edit-id', 'text', '', obj.title + ' azonosító', false, obj.row._id, true);
         AddModalBody(obj.body, 'edit-status', 'number', 'Státusz', obj.title + ' státusz, oka', true, obj.row.status);
         AddModalBody(obj.body, 'edit-statusRsn', 'number', 'Státusz oka', null, true, obj.row.statusRsn);
         AddModalBody(obj.body, 'edit-comment', 'text', 'Komment', 'Komment', false, obj.row.comment);
         AddModalBody(obj.body, 'edit-callsign', 'text', 'Ellenállomás', obj.title + ' ellenállomása', true, obj.row.callsign);
         AddModalBody(obj.body, 'edit-mode', 'number', 'Üzemmód', obj.title + ' módja', true, obj.row.mode);
         AddModalBody(obj.body, 'edit-sRst', 'number', 'Adott riport', obj.title + ' adott riportja, sorszáma', true, obj.row.sRst);
         AddModalBody(obj.body, 'edit-sNum', 'number', 'Adott sorszám', null, true, obj.row.sNum);
         AddModalBody(obj.body, 'edit-rRst', 'number', 'Vett riport', obj.title + ' vett riportja, sorszáma', true, obj.row.rRst);
         AddModalBody(obj.body, 'edit-rNum', 'number', 'Vett sorszám', null, true, obj.row.rNum);
         break;
      }
      case BodyType.DeleteTypeIdCodeName: {
         AddModalBody(obj.body, 'del-type', 'text', 'Típus', obj.title + ' típus', false, obj.row.type._id, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.DeleteIdCodeName, title: obj.title, row: obj.row });
         break;
      }
      case BodyType.DeleteIdCodeName: {
         AddModalBody(obj.body, 'del-id', 'text', '', obj.title + ' azonosító', false, obj.row._id, true);
         AddModalBody(obj.body, 'del-code', 'text', 'Kód', obj.title + ' kód', false, obj.row.code, true);
         AddModalBody(obj.body, 'del-name', 'text', 'Név', obj.title + ' neve', false, obj.row.name, true);
         break;
      }
      case BodyType.DeleteContestIdCodeName: {
         AddModalBody(obj.body, 'del-contest', 'text', 'Verseny', obj.title + ' versenye', false, obj.row.contest._id, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.DeleteIdCodeName, title: obj.title, row: obj.row });
         break;
      }
      case BodyType.OrderNumber: {
         AddModalBody(obj.body, 'modal-order-number', 'text', null, 'Rendelésszám:', null, obj.row.orderNumber, true);
         break;
      }
      case BodyType.OrderSubmitDetails: {
         AddModalBody(obj.body, 'modal-order-number', 'form-inline', null, 'Vevő rendelésszám:', null, obj.row.orderNumber);
         AddModalBody(obj.body, 'modal-supply-date', 'form-inline', null, 'Kiszállítás dátuma:', null, obj.row.supplyDate);
         AddModalBody(obj.body, 'modal-product', 'form-inline', null, 'Termék:', null, obj.row.product);
         AddModalBody(obj.body, 'modal-quantity', 'form-inline', null, 'Mennyiség:', null, obj.row.quantity);
         break;
      }
      case BodyType.Date: {
         AddModalBody(obj.body, 'modal-date', 'date', 'Dátum', 'Dátum:', true, obj.row.date);
         break;
      }
      case BodyType.AddClientComment: {
         [obj.body] = InitBody({ body: obj.body, type: BodyType.HiddenOrderNumber, row: obj.row });
         AddModalBody(obj.body, 'modal-edit-comment', 'textarea', 'Vevő megjegyzése', 'Vevő megjegyzése:', null, obj.row.clientComment);
         break;
      }
      case BodyType.SupplierComment: {
         [obj.body] = InitBody({ body: obj.body, type: BodyType.HiddenOrderNumber, row: obj.row });
         AddModalBody(obj.body, 'modal-comment', 'form-inline', null, 'Szállító megjegyzése:', null, obj.row.supplierComment, true);
         break;
      }
      case BodyType.SupplierEditClientComment: {
         AddModalBody(obj.body, 'modal-comment', 'form-inline', null, 'Szállító megjegyzése:', null, obj.row.supplierComment, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.AddClientComment, row: obj.row });
         break;
      }
      case BodyType.SupplierShowClientComment: {
         AddModalBody(obj.body, 'modal-comment', 'form-inline', null, 'Szállító megjegyzése:', null, obj.row.supplierComment, true);
         [obj.body] = InitBody({ body: obj.body, type: BodyType.ShowClientComment, row: obj.row });
         break;
      }
      case BodyType.ShowClientComment: {
         [obj.body] = InitBody({ body: obj.body, type: BodyType.HiddenOrderNumber, row: obj.row });
         AddModalBody(
            obj.body, 'modal-edit-comment', 'textarea', 'Vevő megjegyzése',
            'Vevő megjegyzése:', null, obj.row.clientComment, true
         );
         break;
      }
      case BodyType.HiddenOrderNumber: {
         AddModalBody(obj.body, 'modal-order-number', 'text', '', '', null, obj.row.orderNumber, null, true);
         break;
      }
      case BodyType.SearchCommentOrderDate: {
         AddModalBody(obj.body, 'search-comment', 'text', 'Vevő megjegyzés', 'Vevő megjegyzés:');
         AddModalBody(obj.body, 'search-date', 'date', 'Rendelés dátuma', 'Rendelés dátuma: ', false, '0000-01-01');
         break;
      }
   }
   if (obj.event) {
      obj.event.forEach((element) => {
         element.next({ title: obj.title ? getTitle(obj.type, obj.title) : undefined, body: obj.body });
      });
   }
   return new Array(count ? count : 1).fill(obj.body);
}
