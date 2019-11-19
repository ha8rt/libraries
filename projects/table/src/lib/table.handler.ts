import { IconClass, IIconClass } from '@ha8rt/icon';
import { Subject } from 'rxjs';

export class Headers {
   rows: IHeader[][] = [];

   constructor(array: (string | IHeader)[]) {
      this.addRow(array);
   }

   public static getHeaderRow(array: (string | IHeader)[]): IHeader[] {
      const headerRow: IHeader[] = [];
      array.forEach((value, index) => {
         if (typeof (value) === 'string') {
            headerRow.push({ str: value });
         } else {
            headerRow.push(value);
         }
      });
      return headerRow;
   }

   addRow(array: (string | IHeader)[]): Headers {
      this.rows.push(Headers.getHeaderRow(array));
      return this;
   }
}

export interface IHeader {
   str: string;
   rowspan?: number;
   colspan?: number;
   classes?: string[];
}

export class Codes {
   fields: IField[] = [];
   constructor(array: (string | IField)[]) {
      array.forEach((value) => {
         if (typeof (value) === 'string') {
            this.fields.push({ field: value });
         } else {
            this.fields.push(value);
         }
      });
   }
}

export interface IField {
   field: string;
   classes?: string[];
}

export interface IButton {
   button: string;
   classes?: string[];
}

export interface ILink {
   link: string;
   value: string;
   params: object;
}

export function getFieldValue(row: any, code: string) {
   while (code && row && code.includes('.')) {
      const i = code.indexOf('.');
      const parent = code.substr(0, i);
      row = row[parent];
      code = code.substr(i + 1);
   }
   return row ? row[code] : undefined;
}

export function convertToBool(rows: any[], fields: string[]) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         row[field] = row[field] !== undefined ? (row[field] === 1 ? true : false) : undefined;
      });
   });
}

export function convertDateToLocale(rows: any[], fields: string[], locale: string) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(row[field]);
         row[field] = date.getTime() > 0 ? date.toLocaleString(locale) : null;
      });
   });
}

export function convertDateToLocaleDate(rows: any[], fields: string[], locale: string) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(row[field]);
         row[field] = date.getTime() > 0 ? date.toLocaleDateString(locale) : null;
      });
   });
}

export function addTooltips(rows: any[], fields: string[], tooltips: string[]) {
   if (fields.length === tooltips.length) {
      rows.forEach((row) => {
         fields.forEach((field, index) => {
            row[field] = [new IconClass(String(row[field]), '', [], row[tooltips[index]])];
         });
      });
   }
}

export function addLinks(rows: any[], field: string, paths: string[], scopes: string[], params?: object) {
   rows.forEach((row) => {
      const obj = Object.assign({}, params);
      if (obj) {
         Object.keys(obj).forEach((key) => {
            obj[key] = row[obj[key]];
         });
      }
      const link: ILink = {
         value: row[field],
         link: '/' + paths.join('/').split('/').filter((value) => !value.includes(':')).join('/')
            + '/' + scopes.map((param) => row[param]).join('/'),
         params: obj,
      };
      row[field] = link;
   });
}

export function addIcon(rows: any[], field: string, icon: IIconClass, condition?: string) {
   rows.forEach((row) => {
      row[field] = !condition || row[condition] ? new IconClass(icon.content, icon.id, icon.classes, icon.tooltip) : undefined;
   });
}

export function addButton(rows: any[], field: string, button: string, classes?: string[], condition?: string) {
   rows.forEach((row) => {
      const btn: IButton = { button, classes };
      row[field] = !condition || row[condition] ? btn : undefined;
   });
}

export interface IPagination {
   totalItems: number;
   itemsPerPage: number;
   nextText: string;
   previousText: string;
   maxSize: number;
   rotate: boolean;
   boundaryLinks: boolean;
   firstText: string;
   lastText: string;
   align: string;
   currentPage: number;
   change: Subject<IPagination>;
}

const thinSpace = '\u202F'; // '\u2009';

export function splitThousands(rows: any[], fields: string[], omitZero: boolean = true, fromLast: boolean = true, blockSize: number = 3) {
   rows.forEach(row => {
      fields.forEach(field => {
         if (omitZero && typeof row[field] === 'number' && row[field] === 0) {
            row[field] = '';
         }
         if (fromLast) {
            row[field] = String(row[field]).split('').reverse().join('');
         }
         row[field] = String(row[field])
            .split('')
            .reduce<string>((previous, current) =>
               previous + current + ((previous.split(thinSpace).join('').length % blockSize === blockSize - 1) ? thinSpace : ''), '')
            .split(thinSpace)
            .filter((value) => value.length > 0)
            .join(thinSpace);
         if (fromLast) {
            row[field] = String(row[field]).split('').reverse().join('');
         }
      });
   });
}

export function cleanSpaces(value: string): string {
   return value.split(' ').filter((chunk) => chunk.length > 0).join('').
      split(thinSpace).filter((chunk) => chunk.length > 0).join('');
}
