import { Config } from '../config/config';

export interface IIconClass {
   class: string;
   str: string;
   id: string;
}

export class IconClass implements IIconClass {
   class: string; str: string; id: string;
   constructor(str: string, id?: string) {
      this.str = str;
      if (id) {
         this.id = id;
      }
      // this.class = 'center';
   }
}

export function initRows(rows: any[], edit = true, del = true) {
   rows.forEach(element => {
      element.icons = [];
      if (edit) {
         element.icons.push(new IconClass(Config.icon.edit));
      }
      if (del) {
         element.icons.push(new IconClass(Config.icon.delete));
      }
   });
}
