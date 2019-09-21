import { faEdit as fasEdit } from '@fortawesome/free-solid-svg-icons';
import { faTimes as fasTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck as fasCheck } from '@fortawesome/free-solid-svg-icons';
import { faPlus as fasPlus } from '@fortawesome/free-solid-svg-icons';
import { faDownload as fasDownload } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots as fasCommentDots } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots as farCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faDollarSign as fasDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Config } from './icon.config';

@Component({
   selector: 'lib-icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.css']
})
export class IconComponent {
   @Input() content: string;
   @Output() iClicked = new EventEmitter();

   fasEdit = fasEdit;
   fasTimes = fasTimes;
   fasCheck = fasCheck;
   fasPlus = fasPlus;
   fasDownload = fasDownload;
   fasCommentDots = fasCommentDots;
   farCommentDots = farCommentDots;
   fasDollarSign = fasDollarSign;
   Config = Config;

   constructor() { }

   onClick() {
      this.iClicked.emit();
   }
}
