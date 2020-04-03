import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type InvalidDataType = (FormControl | FormArray | FormGroup | string[][])[][];

export function AddInvalidControl(invalidData: InvalidDataType, control: FormControl | FormArray | FormGroup, error: string[]) {
   invalidData.splice(0, 0, [control, [error]]);
}

export function AddInvalidError(invalidData: InvalidDataType, control: FormControl | FormArray | FormGroup, error: string[]) {
   for (const data of invalidData) {
      if (data[0] === control) {
         const index = invalidData.indexOf(data);
         (invalidData[index][1] as string[][]).splice(0, 0, error);
         break;
      }
   }
}
