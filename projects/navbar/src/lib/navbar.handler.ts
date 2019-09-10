export interface INav {
   menuText: string;
   link?: [string, string];
   disabled?: boolean;
   submenus?: INav[];
}

export class NavbarHandler {
   mainText: string;
   navs: INav[];

   constructor(mainText: string, navs?: INav[]) {
      this.mainText = mainText;
      if (navs) {
         this.navs = navs;
      }
   }

   public addNav(nav: INav) {
      this.navs.push(nav);
   }

}
