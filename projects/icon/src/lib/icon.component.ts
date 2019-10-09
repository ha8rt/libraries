import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'lib-icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.css']
})
export class IconComponent {
   @Input() content: string;
   @Input() tooltip: string;
   @Output() iClicked = new EventEmitter();

   fas = fas;
   far = far;

   constructor() { }

   onClick() {
      this.iClicked.emit();
   }
}
