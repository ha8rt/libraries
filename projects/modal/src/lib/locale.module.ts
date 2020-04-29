import { NgModule } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale, huLocale, plLocale, roLocale } from 'ngx-bootstrap/locale';

export enum Locales {
   en = 'en-GB',
   hu = 'hu-HU',
   pl = 'pl-PL',
   ro = 'ro-RO',
}

export function defineLocales() {
   defineLocale(Locales.en.toLocaleLowerCase(), enGbLocale);
   defineLocale(Locales.hu.toLocaleLowerCase(), huLocale);
   defineLocale(Locales.pl.toLocaleLowerCase(), plLocale);
   defineLocale(Locales.ro.toLocaleLowerCase(), roLocale);
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
