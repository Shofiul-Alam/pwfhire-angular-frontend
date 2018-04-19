import {User} from "./user";
import {CustomDate} from "./customDate";
import {AllocatedContact} from "./allocatedContact";

export class Client {
    constructor(
        public id: number = 0,
        public companyName: string = null,
        public contactPerson: string = null,
        public companyAbnNo: string = "",
        public companyAcn: string = "",
        public companyTfn: string = "",
        public landlineNo: string = "",
        public mobileNo:string="",
        public accountPayableNo: string = "",
        public accountPayableEmail: string = "",
        public accountPayablePersonDetails:string = "",
        public creditLimit:string = "",
        public invoiceDueDate : CustomDate = new CustomDate(),
        public comments: string = "",
        public chargeRates:string = "",
        public inductions: string = "",
        public user:User = new User(),
        public allocatedContact:Array<AllocatedContact> = [],
        public allContacts:Array<AllocatedContact> = [],
        public splicedAllocatedContact:Array<AllocatedContact> = [],
        public text: string='',
        public archived: boolean = false,
        public firstTime: boolean = null
    ){

    }
}