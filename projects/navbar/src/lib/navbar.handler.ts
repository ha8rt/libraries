import { IIconClass } from '@ha8rt/icon';

export interface IDropdown {
   text: string;
   id?: string;
   link?: Array<string>;
   disabled?: boolean;
   submenus?: IDropdown[];
   divider?: boolean;
   onclick?: boolean;
   classes?: Array<string>;
   tooltip?: string;
   icon?: IIconClass;
}

export interface IButton {
   text: string;
   id: string;
   classes?: Array<string>;
   icon?: IIconClass;
   tooltip?: string;
}

export interface IImage {
   src: string;
   alt: string;
   style?: any;
}

export interface IHeader {
   text: string;
   classes?: Array<string>;
   image?: IImage;
}

export class NavbarHandler {
   header: IHeader;
   navs: IDropdown[] = [];
   buttons: IButton[] = [];

   constructor(header: IHeader, navs?: IDropdown[], buttons?: IButton[]) {
      this.header = header;
      if (navs) {
         this.navs = navs;
      }
      if (buttons) {
         this.buttons = buttons;
      }
   }

   public addNav(nav: IDropdown, index = -1): NavbarHandler {
      if (index >= 0) {
         this.navs.splice(index, 0, nav);
      } else {
         this.navs.push(nav);
      }
      return this;
   }

   public removeNav(id: string): NavbarHandler {
      const index = this.navs.findIndex((value) => value.id === id);
      if (index >= 0) {
         this.navs.splice(index, 1);
      }
      return this;
   }

   public setButtons(buttons: IButton[]): NavbarHandler {
      this.buttons = buttons;
      return this;
   }
}
