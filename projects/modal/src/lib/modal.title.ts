import { BodyType } from './body.handler';

export function getTitle(type: BodyType, title: string): string {
   switch (type) {
      case BodyType.AddContestCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.AddTypeCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.AddCodeName: {
         return title + ' hozzáadása';
      }
      case BodyType.EditContestIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.EditTypeIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.EditIdCodeName: {
         return title + ' módosítása';
      }
      case BodyType.DeleteTypeIdCodeName: {
         return title + ' törlése';
      }
      case BodyType.DeleteIdCodeName: {
         return title + ' törlése';
      }
      case BodyType.DeleteContestIdCodeName: {
         return title + ' törlése';
      }
      default: {
         return title;
      }
   }
}
