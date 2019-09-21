import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { IconModule } from '@ha8rt/icon';

@NgModule({
   declarations: [NavbarComponent],
   imports: [
      CommonModule,
      RouterModule.forChild([]),
      BsDropdownModule.forRoot(),
      IconModule,
   ],
   exports: [NavbarComponent, RouterModule]
})
export class NavbarModule { }
