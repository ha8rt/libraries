import { IModalHandler } from './modal.handler';

export function translateModal(handler: IModalHandler, translate: (key: string) => string): IModalHandler {
   handler.body.forEach((body) => {
      body.label = translate(body.label);
      body.placeHolder = translate(body.placeHolder);
      body.default = translate(body.default);
   });
   handler.buttons.forEach((button) => button.value = translate(button.value));
   // handler.errors
   handler.text = translate(handler.text);
   handler.title = translate(handler.title);
   handler.reqAlert = translate(handler.reqAlert);
   return handler;
}
