import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@ha8rt/icon';

@NgModule({
   declarations: [TableComponent],
   imports: [
      CommonModule,
      RouterModule.forChild([]),
      FormsModule,
      IconModule,
      FormsModule,
   ],
   exports: [TableComponent, RouterModule]
})
export class TableModule { }
