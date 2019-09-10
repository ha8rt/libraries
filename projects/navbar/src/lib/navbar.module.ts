import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';

@NgModule({
   declarations: [NavbarComponent],
   imports: [
      CommonModule,
      RouterModule.forChild([]),
      BsDropdownModule.forRoot(),
   ],
   exports: [NavbarComponent, RouterModule]
})
export class NavbarModule { }
