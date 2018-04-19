
import {CustomDate} from "./customDate";

export class OrderFilter {
    constructor(
        public orderTitle: string = null,
        public startDate: CustomDate = null,
        public endDate: CustomDate = null,
        public projectAddress: string = null,
        public orderStatus: string = null,
        public project: string = null,
        public client: string = null,
        public owner: string = null,
        public comments: string = null
    ){

    }
}