import { Config } from './icon.config';

export interface IIconClass {
   classes: string[];
   content: string;
   id: string;
}

export class IconClass implements IIconClass {
   classes: string[];
   content: string;
   id: string;
   constructor(content: string, id?: string, classes?: string[]) {
      this.content = content;
      if (id) {
         this.id = id;
      }
      if (classes) {
         this.classes = classes;
      }
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

export function isIcons(field): boolean {
   return field instanceof Array && field.every(item => item instanceof IconClass);
}
