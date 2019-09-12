import { Component, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { NavbarHandler } from './navbar.handler';

@Component({
   selector: 'lib-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
   @ViewChildren(BsDropdownDirective) private dropdowns: QueryList<BsDropdownDirective>;
   @Input() handler: NavbarHandler;
   @Output() button = new EventEmitter<string>();

   constructor() { }

   ngOnInit() {
   }

   onMouseOver(element: BsDropdownDirective) {
      this.dropdowns.forEach((item) => {
         if (item !== element && item.placement === 'right') {
            item.hide();
         } else if (item === element) {
            item.show();
         }
      });
   }

   onButton(id: string) {
      this.button.emit(id);
   }
}
