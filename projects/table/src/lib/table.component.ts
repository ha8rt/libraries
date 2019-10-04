import { Component, OnChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { getFieldValue, Headers } from './table.handler';
import { IIconClick, ICheckClick, IFocusOut } from './table.click';
import { isIcons, IconClass } from '@ha8rt/icon';

@Component({
   selector: 'lib-table',
   templateUrl: './table.component.html',
   styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
   @Input() id: number;
   // tslint:disable: no-input-rename
   @Input('h') headers: Headers;
   @Input('c') codes: string[];
   @Input('r') rows: string[];
   @Input('f') filter: boolean;
   @Input() search: boolean;
   @Input('b') button: (string | boolean)[];
   @Input('nr') nr: string;
   @Input('desc') desc: boolean;
   @Input('bfc') btnFiltCond: string;
   @Input('hb') headerBtn: string[];
   @Input('ro') readOnly: boolean;
   @Input('i') inputs: [number[], number[]];

   @Output() rClick = new EventEmitter();
   @Output() bClick = new EventEmitter();
   @Output() hbClick = new EventEmitter();
   @Output() iClick = new EventEmitter<IIconClick>();
   @Output() cClick = new EventEmitter<ICheckClick>();
   @Output() sClick = new EventEmitter();
   @Output() focusOut = new EventEmitter<IFocusOut>();

   @Output() selectChange: EventEmitter<number> = new EventEmitter<number>();
   @Input() set select(value: number) {
      this.selected = value;
   }

   getFieldValue = getFieldValue;

   shown: boolean[];
   filterStr: string;
   selected: number;
   multiRow: boolean;

   isIcons = isIcons;

   constructor() { }

   ngOnChanges() {
      if (this.rows) {
         this.shown = Array(this.rows.length).fill(true);
         if (this.filterStr && this.filterStr.length > 0) {
            this.onFilter(this.filterStr);
         }
      }
      this.multiRow = this.isMultiRow();
   }

   onRowClick(row) {
      this.selected = this.rows.indexOf(row);
      this.rClick.emit(row);
   }

   onBtnClick(row) {
      this.bClick.emit(row);
   }

   onHeaderBtn(event) {
      this.hbClick.emit(event);
   }

   onIconClick(event: IIconClick) {
      this.iClick.emit(event);
   }

   onCheckChange(event: ICheckClick) {
      this.cClick.emit(event);
   }

   onFilter(filterStr: string) {
      this.filterStr = filterStr;
      this.rows.forEach((row, index) => {
         if (this.nr &&
            filterStr.startsWith('#') &&
            (filterStr.length === 1 || filterStr.substring(1) === (this.desc ? this.rows.length - index : index + 1).toString())
         ) {
            // if it is found by the serial number
            this.setRowVisible(row);
            return;
         } else {
            this.setRowVisible(row, false);
         }
         for (const code of this.codes) {
            let item: string;
            const value = getFieldValue(row, code);
            if (isIcons(value)) {
               item = (value as IconClass[]).map((icon) =>
                  !(icon.content.startsWith('fas:') || icon.content.startsWith('far:')) ? icon.content : ''
               ).join('#');
            } else {
               item = '' + value;
            }
            if (item.toUpperCase().includes(filterStr.toUpperCase()) && !this.isBoolean(row[code])) {
               this.setRowVisible(row);
               break;
            }
         }
      });
   }

   onSearch() {
      this.sClick.emit();
   }

   onFocusOut(event: FocusEvent, row: any[], rowId: number, columnId: number) {
      this.focusOut.emit({ row, value: (event.target as any).value, rowId, columnId });
   }

   setRowVisible(row: string, state?: boolean) {
      this.shown[this.rows.indexOf(row)] = (state === undefined) ? true : state;
   }

   getRowVisible(row: string): boolean {
      return this.shown[this.rows.indexOf(row)];
   }

   isBoolean(elem): boolean {
      return typeof elem === 'boolean';
   }

   isLink(elem): boolean {
      return typeof elem === 'object' && elem && elem.link !== undefined;
   }

   isMultiRow(): boolean {
      return this.headers ? this.headers.rows.length > 1 : false;
   }
}
