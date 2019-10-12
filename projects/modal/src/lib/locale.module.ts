import { NgModule } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale, huLocale, plLocale, roLocale } from 'ngx-bootstrap/locale';

export enum Locales {
   en = 'en-en',
   hu = 'hu-hu',
   pl = 'pl-pl',
   ro = 'ro-ro',
}

export function defineLocales() {
   defineLocale(Locales.en, enGbLocale);
   defineLocale(Locales.hu, huLocale);
   defineLocale(Locales.pl, plLocale);
   defineLocale(Locales.ro, roLocale);
}

@NgModule({
   declarations: [],
   imports: [],
   exports: []
})
export class LocaleModule {
   constructor() {
      defineLocales();
   }
}
