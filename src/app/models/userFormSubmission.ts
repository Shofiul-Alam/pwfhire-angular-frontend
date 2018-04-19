
import {Form} from "./Form";
import {User} from "./user";
export class UserFormSubmission {
    constructor(
        public id: number = 0,
        public form:Form = new Form(),
        public user:User = new User()
    ){}
}