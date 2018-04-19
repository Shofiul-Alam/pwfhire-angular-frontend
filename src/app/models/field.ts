
import {ValueArr} from "./valueArr";

export class Field {
    constructor(
        public id: number = 0,
        public label: string = '',
        public type: string = '',
        public subtype: string = '',
        public className: string = '',
        public defaultValue: string = '',
        public required: boolean = false,
        public description: string = '',
        public placeholder: string = '',
        public name: string = '',
        public access: string = '',
        public inline: string = '',
        public min: string = '',
        public max: string = '',
        public formId: string = '',
        public value: string = '',
        public valueArr: Array <ValueArr> = []
    ){}
}