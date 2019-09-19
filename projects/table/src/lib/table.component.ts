import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { getFieldValue, Headers } from './table.handler';
import { IIconClick, ICheckClick } from './table.click';
import { IconClass } from '@ha8rt/icon';

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
   @Input('s') search: boolean;
   @Input('b') button: (string | boolean)[];
   @Input('nr') nr: string;
   @Input('desc') desc: boolean;
   @Input('bfc') btnFiltCond: string;
   @Input('hb') headerBtn: string[];
   @Input('ro') readOnly: boolean;

   @Output() rClick = new EventEmitter();
   @Output() bClick = new EventEmitter();
   @Output() hbClick = new EventEmitter();
   @Output() iClick = new EventEmitter();
   @Output() cClick = new EventEmitter();

   @Output() selectChange: EventEmitter<number> = new EventEmitter<number>();
   @Input() set select(value: number) {
      this.selected = value;
   }

   getFieldValue = getFieldValue;

   shown: boolean[];
   searchStr: string;
   selected: number;
   multiRow: boolean;

   constructor() { }

   ngOnChanges() {
      if (this.rows) {
         this.shown = Array(this.rows.length).fill(true);
         if (this.searchStr && this.searchStr.length > 0) {
            this.onSearch(this.searchStr);
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

   onSearch(searchStr: string) {
      this.searchStr = searchStr;
      this.rows.forEach((row, index) => {
         if (this.nr && searchStr.startsWith('#') && (searchStr.length === 1 || searchStr.substring(1) === (index + 1).toString())) {
            // if it is found by the serial number
            this.setRowVisible(row);
            return;
         } else {
            this.setRowVisible(row, false);
         }
         for (let i = 0, len = this.codes.length; i < len; i++) {
            let item: string;
            if (row[this.codes[i]] && row[this.codes[i]].str) {
               item = '' + row[this.codes[i]].str;
            } else {
               item = '' + getFieldValue(row, this.codes[i]);
            }
            if (item.toUpperCase().includes(searchStr.toUpperCase()) && !this.isBoolean(row[this.codes[i]])) {
               this.setRowVisible(row);
               break;
            }
         }
      });
   }

   setRowVisible(row: string, state?: boolean) {
      this.shown[this.rows.indexOf(row)] = (state === undefined) ? true : state;
   }

   getRowVisible(row: string): boolean {
      return this.shown[this.rows.indexOf(row)];
   }

   isIcons(field): boolean {
      return field instanceof Array && field.every(item => item instanceof IconClass);
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
