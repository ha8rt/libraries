import { InitBody, BodyType, ModalHandler } from '@ha8rt/modal';
import { IconClass, Config } from '@ha8rt/icon';
import { Service, ObjType } from '@ha8rt/http.service';

export interface ICheckClick {
   row: any;
   elem: string;
}

export function onCheckClick(service: Service, event: ICheckClick, callback: (data) => void) {
   const obj: ObjType = {};
   obj._id = event.row._id;
   obj[event.elem] = event.row[event.elem];
   service._put(obj, callback);
}

export interface IIconClick {
   row: any;
   icon: string;
   id: string;
}

export function onIconClick(
   event: IIconClick, edit: ModalHandler, del: ModalHandler, editType: BodyType, delType: BodyType, title: string
) {
   if (event.icon === Config.icon.edit) {
      [edit.body] = InitBody({ type: editType, event: [edit.change], title, row: event.row }, 1);
      edit.event.next();
   } else if (event.icon === Config.icon.delete) {
      [del.body] = InitBody({ type: delType, event: [del.change], title, row: event.row }, 1);
      del.event.next();
   }
}

export interface IEntity {
   _id: string;
   icons?: IconClass[];
}

export function onPushPull(object: IEntity, service: Service, selectedRow: { _id: string }, entity: {}, callback: (data) => void) {
   if (object.icons[0].content === Config.icon.delete) {
      service._put({ _id: selectedRow._id, $pull: entity }, callback);
   } else if (object.icons[0].content === Config.icon.plus) {
      service._put({ _id: selectedRow._id, $push: entity }, callback);
   }
}

export function setState(baseRows: IEntity[], stateRows: IEntity[], selectedBase: number, findField: string) {
   if (baseRows && stateRows && baseRows.length > 0 && stateRows.length > 0) {
      stateRows.forEach(element => {
         if (baseRows[selectedBase][findField] && baseRows[selectedBase][findField].findIndex((value) => value._id === element._id) >= 0) {
            element.icons = [new IconClass(Config.icon.delete)];
         } else {
            element.icons = [new IconClass(Config.icon.plus)];
         }
      });
   }
}

export function onHbClick(add: ModalHandler, type: BodyType, title: string) {
   add.title = 'Kategória típus hozzáadása';
   [add.body] = InitBody({ type, event: [add.change], title }, 1);
   add.event.next();
}
