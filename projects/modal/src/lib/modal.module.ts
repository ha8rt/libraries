import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule as NgxModal } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AlertModule } from '@ha8rt/alert';
import { LocaleModule } from './locale.module';

@NgModule({
   declarations: [ModalComponent],
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgxModal.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TimepickerModule.forRoot(),
      AlertModule,
      LocaleModule
   ],
   exports: [ModalComponent]
})
export class ModalModule { }
