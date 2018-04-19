import {Form} from "./Form";

export class UserFormData {
    constructor(
        public id: number = 0,
        public value: string = "",
        public form: Form = new Form()
    ){}
}