export interface IIconClass {
   classes: string[];
   content: string;
   id: string;
   tooltip?: string;
}

export class IconClass implements IIconClass {
   classes: string[];
   content: string;
   id: string;
   tooltip: string;
   constructor(content: string, id?: string, classes?: string[], tooltip?: string) {
      this.content = content;
      if (id) {
         this.id = id;
      }
      if (classes) {
         this.classes = classes;
      }
      if (tooltip) {
         this.tooltip = tooltip;
      }
   }
}

export function initRows(rows: any[], edit = true, del = true) {
   rows.forEach(element => {
      element.icons = [];
      if (edit) {
         element.icons.push(new IconClass('fas:faEdit'));
      }
      if (del) {
         element.icons.push(new IconClass('fas:faTimes'));
      }
   });
}

export function isIcons(field): boolean {
   return field instanceof Array && field.every(item => item instanceof IconClass);
}
