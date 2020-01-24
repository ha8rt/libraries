import { Component, EventEmitter, Input, Output } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { faComment as farComment, faCommentDots as farCommentDots, faComments as farComments, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons';
// tslint:disable-next-line: max-line-length
import { faBox, faCheck, faChevronDown, faChevronUp, faClipboardCheck, faClipboardList, faCogs, faComment, faCommentDots, faComments, faDollarSign, faDolly, faDownload, faEdit, faGlobeAmericas, faHome, faInfo, faInfoCircle, faKey, faPlus, faPrint, faReceipt, faReplyAll, faSearch, faShare, faSignOutAlt, faThumbtack, faTimes, faTrashAlt, faTruck, faUndoAlt, faUserEdit, faUsersCog, faWarehouse, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
   selector: 'lib-icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.css']
})
export class IconComponent {
   @Input() content: string;
   @Input() tooltip: string;
   @Output() iClicked = new EventEmitter();

   fas = {
      // tslint:disable-next-line: max-line-length
      faPlus, faCheck, faEdit, faTimes, faDownload, faComment, faComments, faCommentDots, faDollarSign, faSignOutAlt, faKey, faTrashAlt, faClipboardCheck, faClipboardList, faDolly, faThumbtack, faTruck, faCogs, faBox, faInfo, faInfoCircle, faPrint, faGlobeAmericas, faHome, faUsersCog, faWarehouse, faSearch, faChevronDown, faChevronUp, faUserEdit, faUndoAlt, faReceipt, faShare, faReplyAll, faSyncAlt
   };
   far = { farEdit, farComment, farComments, farCommentDots };

   constructor() { }

   onClick() {
      this.iClicked.emit();
   }
}
