
import {CustomDate} from "./customDate";

export class EmpAllocationFilter {
    constructor(
        public job:string = null,
        public client: string = null,
        public address: string = null,
        public startDate: CustomDate = null,
        public endDate: CustomDate = null
    ){

    }
}