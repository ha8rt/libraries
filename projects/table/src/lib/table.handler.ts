import { Params } from '@angular/router';
import { IconClass, IIconClass } from '@ha8rt/icon';

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
            this.fields.push({ str: value });
         } else {
            this.fields.push(value);
         }
      });
   }
}

export interface IField {
   str: string;
   classes?: string[];
}

export function center(str: string): IField | IHeader {
   return { str, classes: ['center'] };
}
export function right(str: string): IField | IHeader {
   return { str, classes: ['right'] };
}
export function bolder(str: string): IField {
   return { str, classes: ['bolder'] };
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

export function setFieldValue(row: any, code: string, value: any) {
   while (code && row && code.includes('.')) {
      const i = code.indexOf('.');
      const parent = code.substr(0, i);
      row = row[parent];
      code = code.substr(i + 1);
   }
   if (row) {
      row[code] = value;
   }
}

export function convertToBool<T>(rows: T[], fields: Array<keyof T>) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         row[field] = (row[field] !== undefined ? (Number(row[field]) === 1 ? true : false) : undefined) as any;
      });
   });
}

export function convertDateToLocale<T>(rows: T[], fields: Array<keyof T>, locale: string, options?: Intl.DateTimeFormatOptions) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(String(row[field]));
         row[field] = (date.getTime() > 0 ? date.toLocaleString(locale, options) : null) as any;
      });
   });
}

export function convertDateToLocaleDate<T>(rows: T[], fields: Array<keyof T>, locale: string, options?: Intl.DateTimeFormatOptions) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(String(row[field]));
         row[field] = (date.getTime() > 0 ? date.toLocaleDateString(locale, options) : null) as any;
      });
   });
}

export function convertDateToLocaleTime<T>(rows: T[], fields: Array<keyof T>, locale: string, options?: Intl.DateTimeFormatOptions) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(String(row[field]));
         row[field] = (date.getTime() > 0 ? date.toLocaleTimeString(locale, options) : null) as any;
      });
   });
}

export function splitDateTimeToLocale<T>(rows: T[], fields: Array<keyof T>, locale: string, options?: Intl.DateTimeFormatOptions[]) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         const date = new Date(String(row[field]));
         if (date.getTime() > 0) {
            row[field + 'Date'] = date.toLocaleDateString(locale, options[0]) as any;
            row[field + 'Time'] = date.toLocaleTimeString(locale, options[1]) as any;
         }
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

export function addLinks(rows: any[], field: string, paths: string[], scopes: string[], params?: object, queryParams?: Params) {
   rows.forEach((row) => {
      const obj = Object.assign({}, params);
      if (obj) {
         Object.keys(obj).forEach((key) => {
            obj[key] = getFieldValue(row, obj[key]);
         });
      }
      const link: ILink = {
         value: getFieldValue(row, field),
         link: '/' + paths.join('/').split('/').filter((value) => !value.includes(':')).join('/')
            + '/' + scopes.map((param) => getFieldValue(row, param)).join('/'),
         params: Object.assign(obj, queryParams),
      };
      setFieldValue(row, field, link);
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
