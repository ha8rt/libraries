import { IconClass } from '@ha8rt/icon';

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
   class?: string;
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
   align?: string;
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
         row[field] = row[field] === 1 ? true : false;
      });
   });
}

export function convertDateToLocale(rows: any[], fields: string[], locale: string) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         row[field] = new Date(row[field]).toLocaleString(locale);
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
}
