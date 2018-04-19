import {User} from "./user";

export class Contact{
    constructor(
        public id: string = '',
        public emargencyContact: string = "",
        public landPhone: string = "",
        public address: string = "",
        public text: string = "",
        public user:User = new User()
        ){

    }
}