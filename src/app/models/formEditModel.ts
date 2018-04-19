import {Form} from './Form';
import {Field} from './field';


export class EditFormModel {
    constructor(
        public form: Form = new Form(),
        public formData: Array<Field> = null,
        public editf: boolean = false,
        public editIn: boolean = false
    ){}
}  