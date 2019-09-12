export interface IDropdown {
   menuText: string;
   link?: Array<string>;
   disabled?: boolean;
   submenus?: IDropdown[];
}

export interface IButton {
   text: string;
   id: string;
   class: Array<string>;
}

export class NavbarHandler {
   mainText: string;
   navs: IDropdown[];
   buttons: IButton[];

   constructor(mainText: string, navs?: IDropdown[], buttons?: IButton[]) {
      this.mainText = mainText;
      if (navs) {
         this.navs = navs;
      }
      if (buttons) {
         this.buttons = buttons;
      }
   }

   public addNav(nav: IDropdown) {
      this.navs.push(nav);
   }

   public setButtons(buttons: IButton[]) {
      this.buttons = buttons;
   }
}
