import {User} from "./user";
import {CustomDate} from "./customDate";

export class Admin {
    constructor(
        public id: number = 0,
        public address: string = "",
        public dob: CustomDate = new CustomDate(),
        public position: string = null,
        public responsibilities: string = null,
        public landlineNo: string = "",
        public mobileNo:string="",
        public accountPayableNo: string = "",
        public accountPayableEmail: string = "",
        public invoiceDueDate : CustomDate = new CustomDate(),
        public comments: string = "",
        public inductions: string = "",
        public user:User = new User()
    ){

    }
}