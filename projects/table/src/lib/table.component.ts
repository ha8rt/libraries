import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IconClass, isIcons } from '@ha8rt/icon';
import { Subscription } from 'rxjs';
import { Pagination } from './pagination.handler';
import { cleanSpaces, Codes, getFieldValue, Headers, ILink, setFieldValue } from './table.handler';
import { Icons } from './table.icons';
import { IButtonEvent, ICheckEvent, IColorEvent, IFocusOut, IIconEvent, IPageChanged } from './table.interface';

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
   @Input() filterOn: object;
   @Input() search: boolean;
   @Input() refresh: boolean;
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
   @Output() buttonEvent = new EventEmitter<IButtonEvent<any>>();
   @Output() headerEvent = new EventEmitter<number>();
   @Output() iconEvent = new EventEmitter<IIconEvent<any>>();
   @Output() checkEvent = new EventEmitter<ICheckEvent<any>>();
   @Output() searchEvent = new EventEmitter();
   @Output() refreshEvent = new EventEmitter();
   @Output() focusOut = new EventEmitter<IFocusOut<any>>();
   @Output() pageChanged = new EventEmitter<IPageChanged>();
   @Output() colorEvent = new EventEmitter<IColorEvent<any>>();

   @Output() selectChange: EventEmitter<number> = new EventEmitter<number>();
   @Input() set select(value: number) {
      this.selected = value;
   }

   shown: boolean[];
   filterStr: string;
   selected: number;
   multiRow: boolean;
   isOpen = false;
   icons = Icons;
   pageChangeSubscription: Subscription;
   queryParamsSubscription: Subscription;
   queryParams: Params;
   routerLink: string[];
   filterKeys: boolean;

   constructor(public router: Router, private route: ActivatedRoute) {
      this.routerLink = router.url.split('?')[0].split('/').map((segment) => decodeURIComponent(segment));
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
      const isMultiRow = () => this.headers ? this.headers.rows.length > 1 : false;
      this.multiRow = isMultiRow();
      if (!this.pagination) {
         this.pagination = {
            itemsPerPage: (this.rows ? this.rows.length : 0),
            totalItems: (this.rows ? this.rows.length : 0),
            currentPage: 1
         } as any;
      }
      this.filterKeys = Object.keys(this.filterOn || {}).length > 0;
   }

   onToggle = () => this.isOpen = !this.isOpen;
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
   onRowClick(row: any) {
      if (this.selected === this.rows.indexOf(row)) {
         this.selected = -1;
      } else {
         this.selected = this.rows.indexOf(row);
      }
      this.selectChange.emit(this.selected);
      this.rowEvent.emit(row);
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
   // tslint:disable-next-line: member-ordering
   getFieldValue = getFieldValue;
   // tslint:disable-next-line: member-ordering
   setFieldValue = setFieldValue;
   getRowVisible = (row: any) => this.shown[this.rows.indexOf(row)];
   setRowVisible = (row: any, state?: boolean) => this.shown[this.rows.indexOf(row)] = (state === undefined) ? true : state;
   // tslint:disable-next-line: member-ordering
   isIcons = isIcons;
   isBoolean = (elem: any) => {
      return typeof elem === 'boolean' || (elem.indeterminate !== undefined && typeof elem.indeterminate === 'boolean');
   }
   onCheckBox(row: any, elem: string) {
      if (row[elem].indeterminate !== undefined) {
         const indeterminate = (!row[elem].value && !row[elem].indeterminate) ? true : false;
         const checked = (!row[elem].value && row[elem].indeterminate) ? true : false;
         row[elem].indeterminate = indeterminate;
         row[elem].value = checked;
      } else {
         row[elem] = !row[elem];
      }
   }
   // tslint:disable-next-line: max-line-length
   isReadOnly = (row: any) => this.readOnly && (!this.readOnlyFilter || getFieldValue(row, this.readOnlyFilter)) && (!this.readWriteFilter || !getFieldValue(row, this.readWriteFilter));
   isLink = (elem: any) => typeof elem === 'object' && elem && elem.link !== undefined;
   onLinkClick(event: ILink) {
      window.open(event.link + '?' + Object.keys(event.params).reduce<string>((previous, current) => {
         return previous + '&' + current + '=' + event.params[current];
      }, ''), '_blank');
   }
   isButton = (elem: any) => typeof elem === 'object' && elem && elem.button !== undefined;
   isColor = (elem: any) => typeof elem === 'string' && new RegExp('^#[0-F]{6}$').test(elem.toUpperCase());
   isPagination = () => this.pagination && this.pagination.totalItems > this.pagination.itemsPerPage;
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
}
