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
export function rowspan(str: string, span: number): IHeader {
   return { str, rowspan: span };
}
export function colspan(str: string, span: number): IHeader {
   return { str, colspan: span };
}

export interface IButton {
   button: string;
   classes?: string[];
}

export interface ILink {
   link: string;
   value: string;
   params: object;
   tab?: boolean;
}

export function getFieldValue(row: any, field: string) {
   while (field && row && field.includes('.')) {
      const i = field.indexOf('.');
      const parent = field.substr(0, i);
      row = row[parent];
      field = field.substr(i + 1);
   }
   return row ? row[field] : undefined;
}

export function setFieldValue(row: any, field: string, value: any) {
   while (field && row && field.includes('.')) {
      const i = field.indexOf('.');
      const parent = field.substr(0, i);
      row = row[parent];
      field = field.substr(i + 1);
   }
   if (row) {
      row[field] = value;
   }
}

export function convertToBool<T>(rows: T[], fields: Array<keyof T>, condition?: keyof T, indeterminate?: boolean, indeterminateVal = -1) {
   rows.forEach((row) => {
      if (!condition || row[condition]) {
         fields.forEach((field) => {
            // tslint:disable-next-line: max-line-length
            const value = row[field] !== undefined && row[field] !== indeterminateVal as any ? (Number(row[field]) === 1 ? true : false) : undefined;
            if (indeterminate) {
               row[field] = { value, indeterminate: value === undefined ? true : false } as any;
            } else {
               row[field] = value as any;
            }
         });
      }
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

export function addLinks(
   rows: any[], field: string, paths: string[], scopes: string[], params?: object, queryParams?: Params, tab?: boolean,
) {
   rows.forEach((row) => {
      const obj = Object.assign({}, params);
      if (obj) {
         Object.keys(obj).forEach((key) => {
            obj[key] = getFieldValue(row, obj[key]);
         });
      }
      const link: ILink = {
         value: getFieldValue(row, field),
         link: '/' + paths.join('/').split('/').filter((path) => !path.includes(':')).map((path) => encodeURIComponent(path)).join('/')
            + '/' + scopes.map((param) => encodeURIComponent(getFieldValue(row, param))).join('/'),
         params: Object.assign(obj, queryParams),
         tab
      };
      setFieldValue(row, field, link);
   });
}

export function addRouting(rows: any[], field: string, paths: string[], queryParams?: Params, openTab?: boolean) {
   rows.forEach((row) => {
      const routes: string[] = [];
      paths.forEach((path) => {
         if (path.startsWith('$')) {
            routes.push(getFieldValue(row, path.substring(1)));
         } else {
            routes.push(path);
         }
      });
      const params: Params = {};
      Object.keys(queryParams || {}).forEach((key) => {
         if (queryParams[key].startsWith('$')) {
            params[key] = encodeURIComponent(getFieldValue(row, String(queryParams[key]).substring(1)));
         } else {
            params[key] = encodeURIComponent(queryParams[key]);
         }
      });
      const link: ILink = {
         value: getFieldValue(row, field),
         link: '/' + routes.map((route) => encodeURIComponent(route)).join('/'),
         params,
         tab: openTab,
      };
      setFieldValue(row, field, link);
   });
}

export function addIcon(rows: any[], field: string, icon: IIconClass, conditions?: string[]) {
   rows.forEach((row) => {
      setFieldValue(row, field,
         !conditions || conditions.every((condition) => getFieldValue(row, condition)) ?
            new IconClass(icon.content, icon.id, icon.classes,
               icon.tooltip && icon.tooltip.startsWith('$') ? getFieldValue(row, icon.tooltip.substring(1)) : icon.tooltip,
            ) : getFieldValue(row, field)
      );
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

export function setBoolean<T>(rows: T[], keys: Array<keyof T>, indeterminate?: boolean) {
   rows.forEach((row) => {
      keys.forEach((key) => {
         if (indeterminate) {
            row[key] = { value: Boolean(row[key]), indeterminate: false } as any;
         } else {
            row[key] = Boolean(row[key]) as any;
         }
      });
   });
}
