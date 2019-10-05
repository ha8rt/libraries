import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { IconModule } from '@ha8rt/icon';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
   declarations: [NavbarComponent, SubmenuComponent],
   imports: [
      CommonModule,
      RouterModule.forChild([]),
      BsDropdownModule.forRoot(),
      IconModule,
      TooltipModule.forRoot(),
   ],
   exports: [NavbarComponent, RouterModule]
})
export class NavbarModule { }
