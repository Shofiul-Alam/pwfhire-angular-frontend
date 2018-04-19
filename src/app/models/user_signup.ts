/**
 * Created by User on 11/14/2017.
 */
import {UserType} from "./UserType";

export class User{
    constructor(
        public id: number = 0,
        public firstName: string = "",
        public lastName: string = "",
        public email: string = "",
        public password: string = "",
        public mobile: string = "",
        public userType: UserType = new UserType()
    ){

    }
}