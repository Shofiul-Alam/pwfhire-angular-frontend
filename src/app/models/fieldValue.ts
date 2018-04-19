
import { ValueArr } from "./valueArr";

export class FieldValue {
    constructor(
        public id: number = 0,
        public value: string = '',
        public fieldId: string = '',
        public formId: string = '',
        public valueArr: ValueArr = new ValueArr()
    ){}
}