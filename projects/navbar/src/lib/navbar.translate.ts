import { IDropdown } from './navbar.handler';

export function translateDropdown(dropdown: IDropdown, translate: (key: string) => string) {
   translateSubmenus([dropdown], translate);
}

function translateSubmenus(submenus: IDropdown[], translate: (key: string) => string) {
   if (submenus) {
      submenus.forEach((submenu) => {
         if (submenu) {
            submenu.text = translate(submenu.text);
            submenu.tooltip = translate(submenu.tooltip);
            if (submenu.icon) {
               submenu.icon.tooltip = translate(submenu.icon.tooltip);
            }
            translateSubmenus(submenu.submenus, translate);
         }
      });
   }
}
