export interface IInputs{
    /**select/text/email/password/number/date/color/tel/url/etc., req*/
    type: string;
    /**req*/
    id: string;
    /**req*/
    name: string;
    /**true/false*/
    required?: boolean;
    /**1-12, req*/
    sizesm: number;
    /**1-12, req*/
    sizemd: number;
    /**1-12, req*/
    sizelg: number;
    placeholder?: string;
    initValue?: string;
    /**if type==select*/
    options?: IOptions[];
    label: string;
}

export interface IOptions{
    value: string;
    text: string;
}