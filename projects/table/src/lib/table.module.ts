import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconModule } from '@ha8rt/icon';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ColorPickerModule } from 'ngx-color-picker';
import { TableComponent } from './table.component';

@NgModule({
   declarations: [TableComponent],
   imports: [
      CommonModule,
      RouterModule.forChild([]),
      FormsModule,
      IconModule,
      PaginationModule.forRoot(),
      ColorPickerModule,
   ],
   exports: [TableComponent, RouterModule]
})
export class TableModule { }
