import {UserType} from "./UserType";

export class User{
    constructor(
        public id: number = 0,
        public firstName: string = "",
        public lastName: string = "",
        public email: string = "",
        public password: string = null,
        public mobile: string = "",
        public userType: UserType = new UserType()
    ){

    }
}