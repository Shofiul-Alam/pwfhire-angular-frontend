import {User} from "./user";

export class Supplier {
    constructor(
        public id: number = 0,
        public companyName: string = "",
        public companyAbnNo: string = "",
        public landlineNo: string = "",
        public mobileNo:string="",
        public accountPayableNo: string = "",
        public accountPayableEmail: string = "",
        public accountPayablePersonDetails:string = "",
        public creditLimit:string = "",
        public invoiceDueDate : string ="",
        public comments: string = "",
        public chargeRates:string = "",
        public inductions: string = "",
        public extra: string = "",
        public user:User = new User()
    ){

    }
}