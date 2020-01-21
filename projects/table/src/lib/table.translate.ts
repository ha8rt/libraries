import { Headers } from './table.handler';

export function translateHeaders(headers: Headers, translate: (key: string) => string) {
   headers.rows.forEach((row) => {
      row.forEach((header) => {
         header.str = translate(header.str);
      });
   });
}

export function translateRows(rows: any[], fields: string[], translate: (key: string) => string) {
   rows.forEach((row) => {
      fields.forEach((field) => {
         row[field] = translate(row[field]);
      });
   });
}

export function translateFlags(targetRows: any[], targetField: string, sourceRows: any[], matchField: string, sourceField: string) {
   targetRows.forEach((targetRow) => {
      const source = sourceRows.find((sourceRow) => String(sourceRow[matchField]) === String(targetRow[targetField]));
      targetRow[targetField] = source ? source[sourceField] : targetRow[targetField];
   });
}

export function translateMenus(rows: any[], translate: (key: string) => string): any[] {
   rows.forEach(row => {
      row.menu = String(row.menu).split(' > ').reduce<string>((previous, current) =>
         previous + (previous.length > 0 ? ' > ' : '') + translate(current), '');
   });
   return rows;
}
