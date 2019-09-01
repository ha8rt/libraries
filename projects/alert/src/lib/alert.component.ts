import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'lib-alert',
   templateUrl: './alert.component.html',
   styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
   @Input() data: [];

   constructor() { }

   ngOnInit() {
   }

}
