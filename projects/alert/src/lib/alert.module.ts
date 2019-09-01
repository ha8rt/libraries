import { NgModule } from '@angular/core';
import { AlertComponent } from './alert.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
   declarations: [AlertComponent],
   imports: [
      FormsModule,
      CommonModule,
   ],
   exports: [AlertComponent]
})
export class AlertModule { }
