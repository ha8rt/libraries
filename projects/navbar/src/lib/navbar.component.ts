import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavbarHandler } from './navbar.handler';
import { isIcons } from '@ha8rt/icon';

@Component({
   selector: 'lib-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
   @Input() handler: NavbarHandler;
   @Output() button = new EventEmitter<string>();

   isIcons = isIcons;

   constructor() { }

   ngOnInit() {
   }

   onButton(id: string) {
      this.button.emit(id);
   }
}
