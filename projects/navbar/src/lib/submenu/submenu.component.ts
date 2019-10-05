import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { IDropdown } from '../navbar.handler';
import { isIcons } from '@ha8rt/icon';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
   selector: 'lib-submenu',
   templateUrl: './submenu.component.html',
   styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {
   @ViewChildren(BsDropdownDirective) private dropdowns: QueryList<BsDropdownDirective>;
   @Input() parent: IDropdown;
   @Output() button = new EventEmitter<string>();

   isIcons = isIcons;

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
