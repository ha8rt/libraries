export interface ICheckEvent<U> {
   row: U;
   elem: string;
}

export interface IIconEvent<U> {
   row: U;
   icon: string;
   id: string;
}

export interface IFocusOut<U> {
   row: U;
   value: string;
   rowId: number;
   columnId: number;
}

export interface IPageChanged {
   page: number;
   itemsPerPage: number;
}

export interface IButtonEvent<U> {
   row: U;
   id: string;
}

export interface IColorEvent<U> {
   row: U;
   elem: string;
}
