import { Component, OnChanges, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { getFieldValue, Headers, IPagination, Codes, ILink, cleanSpaces } from './table.handler';
import { IIconClick, ICheckClick, IFocusOut, IPageChanged, IButtonClick } from './table.click';
import { isIcons, IconClass } from '@ha8rt/icon';
import { Icons } from './table.icons';
import { Subscription } from 'rxjs';

@Component({
   selector: 'lib-table',
   templateUrl: './table.component.html',
   styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
   @Input() id: number;
   // tslint:disable: no-input-rename
   @Input('h') headers: Headers;
   @Input('c') codes: Codes;
   @Input('r') rows: any[];
   @Input('f') filter: boolean;
   @Input('s') search: boolean;
   @Input('nr') nr: string;
   @Input('desc') desc: boolean;
   @Input('hb') headerBtn: string[];
   @Input('ro') readOnly: boolean;
   @Input('rof') readOnlyFilter: string;
   @Input('rwf') readWriteFilter: string;
   @Input('i') inputs: [number[], number[]];
   @Input('p') pagination: IPagination;
   @Input('l') label: string;
   @Input('t') toggle: boolean = undefined;
   @Input() rowStyles: object[];

   @Output() rClick = new EventEmitter();
   @Output() bClick = new EventEmitter<IButtonClick<any>>();
   @Output() hbClick = new EventEmitter();
   @Output() iClick = new EventEmitter<IIconClick<any>>();
   @Output() cClick = new EventEmitter<ICheckClick<any>>();
   @Output() sClick = new EventEmitter();
   @Output() focusOut = new EventEmitter<IFocusOut<any>>();
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
   pageChange: Subscription;

   constructor() { }

   ngOnInit() {
      this.isOpen = this.toggle;
      if (this.pagination && this.pagination.change) {
         this.pageChange = this.pagination.change.asObservable().subscribe((pagination) => {
            this.pagination = pagination;
         });
      }
   }

   ngOnDestroy() {
      if (this.pageChange) {
         this.pageChange.unsubscribe();
      }
   }

   ngOnChanges() {
      if (this.rows) {
         this.shown = Array(this.rows.length).fill(true);
         if (this.filterStr && this.filterStr.length > 0) {
            this.onFilter(this.filterStr);
         }
      }
      this.multiRow = this.isMultiRow();
      if (!this.pagination) {
         this.pagination = { itemsPerPage: 0, totalItems: (this.rows ? this.rows.length : 0), currentPage: 1 } as any;
      }
   }

   onRowClick(row: any) {
      if (this.selected === this.rows.indexOf(row)) {
         this.selected = -1;
      } else {
         this.selected = this.rows.indexOf(row);
      }
      this.rClick.emit(row);
   }

   onBtnClick(event: IButtonClick<any>) {
      this.bClick.emit(event);
   }

   onHeaderBtn(event) {
      this.hbClick.emit(event);
   }

   onIconClick(event: IIconClick<any>) {
      this.iClick.emit(event);
   }

   onCheckChange(event: ICheckClick<any>) {
      this.cClick.emit(event);
   }

   onFilter(filterStr: string) {
      this.filterStr = cleanSpaces(filterStr);
      this.rows.forEach((row, index) => {
         if (this.nr &&
            this.filterStr.startsWith('#') &&
            (this.filterStr.length === 1 ||
               this.filterStr.substring(1) === (
                  this.desc
                     ? (this.pagination.totalItems - (this.pagination.itemsPerPage * (this.pagination.currentPage - 1)) - index).toString()
                     : (this.pagination.itemsPerPage * (this.pagination.currentPage - 1) + index + 1).toString()))
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
               item = ([value] as IconClass[]).map((icon) =>
                  !(icon.content.startsWith('fas:') || icon.content.startsWith('far:')) ? icon.content : ''
               ).join('#');
            } else if (this.isLink(value)) {
               item = (value as ILink).value;
            } else {
               item = cleanSpaces(String(value));
            }
            if (item.toUpperCase().includes(this.filterStr.toUpperCase()) && !this.isBoolean(row[code.field])) {
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
      this.pageChanged.emit(event);
   }

   onToggle() {
      this.isOpen = !this.isOpen;
   }

   setRowVisible(row: any, state?: boolean) {
      this.shown[this.rows.indexOf(row)] = (state === undefined) ? true : state;
   }

   getRowVisible(row: any): boolean {
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

   isReadOnly(row: any): boolean {
      return this.readOnly
         && (!this.readOnlyFilter || getFieldValue(row, this.readOnlyFilter))
         && (!this.readWriteFilter || !getFieldValue(row, this.readWriteFilter));
   }

   getRowStyles(row: any): string {
      if (this.rowStyles) {
         return this.rowStyles.map((style) => {
            if (row[Object.keys(style)[0]]) {
               return style[Object.keys(style)[0]];
            }
         }).join(' ');
      } else {
         return '';
      }
   }
}
