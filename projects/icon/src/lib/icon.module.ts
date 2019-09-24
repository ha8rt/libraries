import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
   declarations: [IconComponent],
   imports: [
      FormsModule,
      CommonModule,
      FontAwesomeModule,
      TooltipModule.forRoot(),
   ],
   exports: [IconComponent]
})
export class IconModule { }
