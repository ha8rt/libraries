import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { IPageChanged } from './table.interface';

export class Pagination {
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
   routeProvided: boolean;
   change: Subject<Pagination> = new Subject<Pagination>();
   scrollToTop = true;

   private current: number;

   set currentPage(currentPage: number) {
      this.current = currentPage;
      this.change.next(this);
   }
   get currentPage(): number {
      return this.current;
   }

   constructor(totalItems: number, translate?: (key: string) => string, route?: ActivatedRoute) {
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
      this.routeProvided = route !== undefined;
      const page = this.routeProvided ? route.snapshot.queryParamMap.get('page') : 1;
      this.current = !isNaN(Number(page)) && page !== null ? Number(page) : 1;
   }

   from(): { from: number } {
      return { from: (this.currentPage - 1) * (this.itemsPerPage) + 1 };
   }

   to(): { to: number } {
      return { to: this.currentPage * this.itemsPerPage };
   }

   inr(): { from: number, to: number } {
      return Object.assign(this.from(), this.to());
   }

   skip(): { skip: number } {
      return { skip: (this.currentPage - 1) * this.itemsPerPage };
   }

   limit(): { limit: number } {
      return { limit: this.itemsPerPage };
   }

   aggr(): { skip: number, limit: number } {
      return Object.assign(this.skip(), this.limit());
   }

   reset(callback: () => void) {
      this.currentPage = 1;
      this.itemsPerPage = 20;
      callback();
   }

   page(event: IPageChanged, callback: () => void) {
      this.currentPage = event.page;
      if (scrollToTop) {
         scrollToTop();
      }
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
