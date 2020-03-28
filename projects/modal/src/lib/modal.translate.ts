import { ModalHandler } from './modal.handler';

export function translateModal(handler: ModalHandler, translate: (key: string) => string): ModalHandler {
   handler.body.forEach((body) => {
      body.label = translate(body.label);
      body.placeHolder = translate(body.placeHolder);
      body.default = translate(body.default);
      body.errors = (body.errors || []).map((error) => error.map((field, idx) => idx > 0 ? translate(field) : field));
   });
   handler.buttons.forEach((button) => button.value = translate(button.value));
   handler.errors = handler.errors.map((error) => error.map((field, idx) => idx > 0 ? translate(field) : field));
   handler.text = translate(handler.text);
   handler.title = translate(handler.title);
   handler.reqAlert = translate(handler.reqAlert);
   return handler;
}
