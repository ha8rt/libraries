import { Body, HttpService } from '@ha8rt/http.service';

export function onButton(service: HttpService, event: Body, callback: (data: any) => void) {
   const button = event.getKey();
   if (button === 'add-ok') {
      service._post(event, callback);
   } else if (button === 'edit-ok') {
      service._patch(event, callback);
   } else if (button === 'del-ok') {
      service._delete(event, callback);
   }
}
