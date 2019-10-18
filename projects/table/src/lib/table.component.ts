import { Component, OnChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { getFieldValue, Headers, IPagination, Codes } from './table.handler';
import { IIconClick, ICheckClick, IFocusOut, IPageChanged, IButtonClick } from './table.click';
import { isIcons, IconClass } from '@ha8rt/icon';
import { Icons } from './table.icons';

@Component({
   selector: 'lib-table',
   templateUrl: './table.component.html',
   styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
   @Input() id: number;
   // tslint:disable: no-input-rename
   @Input('h') headers: Headers;
   @Input('c') codes: Codes;
   @Input('r') rows: string[];
   @Input('f') filter: boolean;
   @Input('s') search: boolean;
   @Input('nr') nr: string;
   @Input('desc') desc: boolean;
   @Input('hb') headerBtn: string[];
   @Input('ro') readOnly: boolean;
   @Input('i') inputs: [number[], number[]];
   @Input('p') pagination: IPagination;
   @Input('l') label: string;
   @Input('t') toggle: boolean = undefined;

   @Output() rClick = new EventEmitter();
   @Output() bClick = new EventEmitter<IButtonClick>();
   @Output() hbClick = new EventEmitter();
   @Output() iClick = new EventEmitter<IIconClick>();
   @Output() cClick = new EventEmitter<ICheckClick>();
   @Output() sClick = new EventEmitter();
   @Output() focusOut = new EventEmitter<IFocusOut>();
   @Output() pageChanged = new EventEmitter<IPageChanged>();

   @Output() selectChange: EventEmitter<number> = new EventEmitter<number>();
   @Input() set select(value: number) {
      this.selected = value;
   }

   getFieldValue = getFieldValue;

   shown: boolean[];
   filterStr: string;
   selected: number;
   multiRow: boolean;
   isOpen = false;
   icons = Icons;
   isIcons = isIcons;
   totalItems: number;
   page = 1;
   itemsPerPage: number;

   constructor() { }

   ngOnInit() {
      this.isOpen = this.toggle;
   }

   ngOnChanges() {
      if (this.rows) {
         this.shown = Array(this.rows.length).fill(true);
         if (this.filterStr && this.filterStr.length > 0) {
            this.onFilter(this.filterStr);
         }
      }
      this.multiRow = this.isMultiRow();
      this.itemsPerPage = this.pagination ? this.pagination.itemsPerPage : 0;
      this.totalItems = this.pagination ? this.pagination.totalItems : (this.rows ? this.rows.length : 0);
   }

   onRowClick(row) {
      this.selected = this.rows.indexOf(row);
      this.rClick.emit(row);
   }

   onBtnClick(event: IButtonClick) {
      this.bClick.emit(event);
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
            (filterStr.length === 1 ||
               filterStr.substring(1) === (
                  this.desc ? (this.totalItems - (this.itemsPerPage * (this.page - 1)) - index).toString()
                     : (this.itemsPerPage * (this.page - 1) + index + 1).toString()))
         ) {
            // if it is found by the serial number
            this.setRowVisible(row);
            return;
         } else {
            this.setRowVisible(row, false);
         }
         for (const code of this.codes.fields) {
            let item: string;
            const value = getFieldValue(row, code.field);
            if (isIcons([value])) {
               item = (value as IconClass[]).map((icon) =>
                  !(icon.content.startsWith('fas:') || icon.content.startsWith('far:')) ? icon.content : ''
               ).join('#');
            } else {
               item = '' + value;
            }
            if (item.toUpperCase().includes(filterStr.toUpperCase()) && !this.isBoolean(row[code.field])) {
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

   onPageChanged(event: IPageChanged) {
      this.page = event.page;
      this.pageChanged.emit(event);
   }

   onToggle() {
      this.isOpen = !this.isOpen;
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

   isButton(elem) {
      return typeof elem === 'object' && elem && elem.button !== undefined;
   }

   isLink(elem): boolean {
      return typeof elem === 'object' && elem && elem.link !== undefined;
   }

   isMultiRow(): boolean {
      return this.headers ? this.headers.rows.length > 1 : false;
   }

   isPagination(): boolean {
      return this.pagination && this.pagination.totalItems > this.pagination.itemsPerPage;
   }
}
