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
}
