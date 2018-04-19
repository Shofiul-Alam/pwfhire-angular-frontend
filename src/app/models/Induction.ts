import {Form} from "./Form";
import {Project} from "./project";


export class Induction {
    constructor(
        public id: string = '',
        public name: string = "",
        public form: Form = new Form(),
        public project: Project = new Project(),
        public text: string = ''
    ){}
}