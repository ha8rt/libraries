import { IDropdown, IButton } from './navbar.handler';

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

export function translateButtons(buttons: IButton[], translate: (key: string) => string) {
   buttons.forEach((button) => {
      if (button) {
         button.text = translate(button.text);
         button.tooltip = translate(button.tooltip);
         if (button.icon) {
            button.icon.tooltip = translate(button.icon.tooltip);
         }
      }
   });
}
