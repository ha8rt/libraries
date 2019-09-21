import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
   declarations: [SelectComponent],
   imports: [
      CommonModule,
      ReactiveFormsModule,
   ],
   exports: [SelectComponent]
})
export class SelectModule { }
