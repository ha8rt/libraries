import { IQuery, IType } from '@ha8rt/http.service';
import { Subject } from 'rxjs';
import { IPageChanged } from './table.click';
import { IPagination } from './table.handler';

export class Pagination implements IPagination {
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

   change: Subject<Pagination> = new Subject<Pagination>();
   private current: number;

   set currentPage(currentPage: number) {
      this.current = currentPage;
      this.change.next(this);
   }
   get currentPage(): number {
      return this.current;
   }

   constructor(totalItems: number, translate?: (key: string) => string) {
      if (!translate) {
         translate = (key: string) => key;
      }
      this.itemsPerPage = 20;
      this.maxSize = 5;
      this.nextText = translate('Next');
      this.previousText = translate('Previous');
      this.rotate = true;
      this.totalItems = totalItems;
      this.boundaryLinks = true;
      this.firstText = translate('First');
      this.lastText = translate('Last');
      this.align = 'center';
      this.currentPage = 1;
   }

   from(): IType {
      return new IType('from', String((this.currentPage - 1) * this.itemsPerPage + 1));
   }

   to(): IType {
      return new IType('to', String(this.currentPage * this.itemsPerPage));
   }

   inr(): IQuery {
      return new IQuery([this.from(), this.to()]);
   }

   reset(callback: () => void) {
      this.currentPage = 1;
      this.itemsPerPage = 20;
      callback();
   }

   page(event: IPageChanged, callback: () => void) {
      this.currentPage = event.page;
      scrollToTop();
      callback();
   }

   total(totalItems: number) {
      this.totalItems = totalItems;
      this.change.next(this);
   }
}

export function scrollToTop() {
   const scroll = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
         window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
         window.clearInterval(scroll);
      }
   }, 16);
}
