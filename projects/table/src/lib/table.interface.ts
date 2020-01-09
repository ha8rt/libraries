export interface ICheckClick<U> {
   row: U;
   elem: string;
}

export interface IIconClick<U> {
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

export interface IButtonClick<U> {
   row: U;
   id: string;
}
