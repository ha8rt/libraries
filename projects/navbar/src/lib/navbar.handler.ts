export interface IDropdown {
   menuText: string;
   id?: string;
   link?: Array<string>;
   disabled?: boolean;
   submenus?: IDropdown[];
   divider?: boolean;
   onclick?: boolean;
}

export interface IButton {
   text: string;
   id: string;
   class: Array<string>;
}

export class NavbarHandler {
   mainText: string;
   navs: IDropdown[] = [];
   buttons: IButton[] = [];

   constructor(mainText: string, navs?: IDropdown[], buttons?: IButton[]) {
      this.mainText = mainText;
      if (navs) {
         this.navs = navs;
      }
      if (buttons) {
         this.buttons = buttons;
      }
   }

   public addNav(nav: IDropdown): NavbarHandler {
      this.navs.push(nav);
      return this;
   }

   public removeNav(id: string): NavbarHandler {
      this.navs.splice(this.navs.findIndex((value) => value.id === id), 1);
      return this;
   }

   public setButtons(buttons: IButton[]): NavbarHandler {
      this.buttons = buttons;
      return this;
   }
}
