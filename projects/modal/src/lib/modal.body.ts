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
}

export function AddModalBody(modalBody: ModalBody,
   // tslint:disable-next-line: align
   id: string, type: string, placeHolder: string, label?: string, required?: boolean, value?: string, disabled?: boolean) {
   modalBody.push({ id, type, placeHolder, value, required, disabled, label });
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
}

export interface InitBodyObj {
   type: BodyType;
   event?: Subject<ChangeType>[];
   title?: string;
   row?: any;
   body?: ModalBody;
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
   }
   if (obj.event) {
      obj.event.forEach((element) => {
         element.next({ title: obj.title ? getTitle(obj.type, obj.title) : undefined, body: obj.body });
      });
   }
   return new Array(count ? count : 1).fill(obj.body);
}

function getTitle(type: BodyType, title: string): string {
   switch (type) {
      case BodyType.AddContestCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.AddTypeCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.AddCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.EditContestIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.EditTypeIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.EditIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.DeleteTypeIdCodeName: {
         return title + ' törlése';
      }
      case BodyType.DeleteIdCodeName: {
         return title + ' törlése';
      }
      case BodyType.DeleteContestIdCodeName: {
         return title + ' törlése';
      }
      default: {
         return null;
      }
   }
}
