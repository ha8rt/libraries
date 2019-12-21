import { InitBody, BodyType, IModalHandler } from '@ha8rt/modal';
import { IconClass } from '@ha8rt/icon';
import { ObjType, HttpService } from '@ha8rt/http.service';
import { Icons } from './table.icons';

export interface ICheckClick<U> {
   row: U;
   elem: string;
}

export function onCheckClick(service: HttpService, event: ICheckClick<any>, callback: (data) => void) {
   const obj: ObjType = {};
   obj._id = event.row._id;
   obj[event.elem] = event.row[event.elem];
   service._put(obj, callback);
}

export interface IIconClick<U> {
   row: U;
   icon: string;
   id: string;
}

export function onIconClick(
   event: IIconClick<any>, edit: IModalHandler, del: IModalHandler, editType: BodyType, delType: BodyType, title: string
) {
   if (event.icon === Icons.edit) {
      [edit.body] = InitBody({ type: editType, event: [edit.change], title, row: event.row }, 1);
      edit.event.next();
   } else if (event.icon === Icons.delete) {
      [del.body] = InitBody({ type: delType, event: [del.change], title, row: event.row }, 1);
      del.event.next();
   }
}

export interface IEntity {
   _id: string;
   icons?: IconClass[];
}

export function onPushPull(object: IEntity, service: HttpService, selectedRow: { _id: string }, entity: {}, callback: (data) => void) {
   if (object.icons[0].content === Icons.delete) {
      service._put({ _id: selectedRow._id, $pull: entity }, callback);
   } else if (object.icons[0].content === Icons.plus) {
      service._put({ _id: selectedRow._id, $push: entity }, callback);
   }
}

export function setState(baseRows: IEntity[], stateRows: IEntity[], selectedBase: number, findField: string) {
   if (baseRows && stateRows && baseRows.length > 0 && stateRows.length > 0) {
      stateRows.forEach(element => {
         if (baseRows[selectedBase][findField] && baseRows[selectedBase][findField].findIndex((value) => value._id === element._id) >= 0) {
            element.icons = [new IconClass(Icons.delete)];
         } else {
            element.icons = [new IconClass(Icons.plus)];
         }
      });
   }
}

export function onHbClick(add: IModalHandler, type: BodyType, title: string) {
   add.title = 'Kategória típus hozzáadása';
   [add.body] = InitBody({ type, event: [add.change], title }, 1);
   add.event.next();
}

export interface IFocusOut<U> {
   row: U;
   value: string;
   rowId: number;
   columnId: number;
}

export interface IPageChanged {
   page: number;
   itemsPerPage: number;
}

export interface IButtonClick<U> {
   row: U;
   id: string;
}
