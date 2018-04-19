import {Field} from './field';
export class Form {
    constructor(
        public id: number = 0,
        public formName: string = "",
        public fieldsArr:Array <Field> = []
    ){}
}