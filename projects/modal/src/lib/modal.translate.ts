import { ModalHandler } from './modal.handler';

export function translateModal(handler: ModalHandler, translate: (key: string) => string): ModalHandler {
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
