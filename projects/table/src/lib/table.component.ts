import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IconClass, isIcons } from '@ha8rt/icon';
import { Subscription } from 'rxjs';
import { Pagination } from './pagination.handler';
import { cleanSpaces, Codes, getFieldValue, Headers, ILink } from './table.handler';
import { Icons } from './table.icons';
import { IButtonClick, ICheckClick, IFocusOut, IIconClick, IPageChanged } from './table.interface';

@Component({
   selector: 'lib-table',
   templateUrl: './table.component.html',
   styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
   @Input() id: number;
   @Input() headers: Headers;
   @Input() codes: Codes;
   @Input() rows: any[];
   @Input() filter: boolean;
   @Input() search: boolean;
   @Input() nr: string;
   @Input() desc: boolean;
   @Input() headerButtons: string[];
   @Input() readOnly: boolean;
   @Input() readOnlyFilter: string;
   @Input() readWriteFilter: string;
   @Input() inputs: [number[], number[]];
   @Input() pagination: Pagination;
   @Input() label: string;
   @Input() toggle: boolean = undefined;
   @Input() rowStyles: object[];

   @Output() rowEvent = new EventEmitter();
   @Output() buttonEvent = new EventEmitter<IButtonClick<any>>();
   @Output() headerEvent = new EventEmitter<number>();
   @Output() iconEvent = new EventEmitter<IIconClick<any>>();
   @Output() checkEvent = new EventEmitter<ICheckClick<any>>();
   @Output() searchEvent = new EventEmitter();
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
   pageChangeSubscription: Subscription;
   queryParamsSubscription: Subscription;
   queryParams: Params;

   constructor(private router: Router, private route: ActivatedRoute) {
   }

   ngOnInit() {
      this.isOpen = this.toggle;
      if (this.pagination && this.pagination.change) {
         this.pageChangeSubscription = this.pagination.change.asObservable().subscribe((pagination) => {
            this.pagination = pagination;
         });
         this.queryParamsSubscription = this.route.queryParams.subscribe((queryParams) => {
            this.queryParams = queryParams;
            if (!isNaN(Number(queryParams.page)) && this.pagination && Number(queryParams.page) !== this.pagination.currentPage) {
               this.pagination.currentPage = Number(queryParams.page);
            }
         });
      }
   }

   ngOnDestroy() {
      if (this.pageChangeSubscription) {
         this.pageChangeSubscription.unsubscribe();
      }
      if (this.queryParamsSubscription) {
         this.queryParamsSubscription.unsubscribe();
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
         this.pagination = {
            itemsPerPage: (this.rows ? this.rows.length : 0),
            totalItems: (this.rows ? this.rows.length : 0),
            currentPage: 1
         } as any;
      }
   }

   onRowClick(row: any) {
      if (this.selected === this.rows.indexOf(row)) {
         this.selected = -1;
      } else {
         this.selected = this.rows.indexOf(row);
      }
      this.selectChange.emit(this.selected);
      this.rowEvent.emit(row);
   }

   onBtnClick(event: IButtonClick<any>) {
      this.buttonEvent.emit(event);
   }

   onHeaderButtons(event: number) {
      this.headerEvent.emit(event);
   }

   onIconClick(event: IIconClick<any>) {
      this.iconEvent.emit(event);
   }

   onCheckChange(event: ICheckClick<any>) {
      this.checkEvent.emit(event);
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
            const value = getFieldValue(row, code.str);
            if (isIcons([value])) {
               item = ([value] as IconClass[]).map((icon) =>
                  !(icon.content.startsWith('fas:') || icon.content.startsWith('far:')) ? icon.content : ''
               ).join('#');
            } else if (this.isLink(value)) {
               item = (value as ILink).value;
            } else {
               item = cleanSpaces(String(value));
            }
            if (item.toUpperCase().includes(this.filterStr.toUpperCase()) && !this.isBoolean(row[code.str])) {
               this.setRowVisible(row);
               break;
            }
         }
      });
   }

   onSearch() {
      this.searchEvent.emit();
   }

   onFocusOut(event: FocusEvent, row: any[], rowId: number, columnId: number) {
      this.focusOut.emit({ row, value: (event.target as any).value, rowId, columnId });
   }

   onPageChanged(event: IPageChanged) {
      if (Number(this.queryParams.page) !== event.page || !this.pagination.routeProvided) {
         this.pageChanged.emit(event);
         this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event.page },
            replaceUrl: true,
            queryParamsHandling: 'merge',
         });
      }
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
