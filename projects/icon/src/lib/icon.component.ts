import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Config } from './icon.config';

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

   Config = Config;

   constructor() { }

   onClick() {
      this.iClicked.emit();
   }
}
