
import {CustomDate} from "./customDate";


export class TimesheetFilter {
    constructor(
        public taskName: string = null,
        public client: string = null,
        public proAddress: string = null,
        public startDate: CustomDate = null,
        public endDate: CustomDate = null,
        public startTime: string = null,
        public endTime: string =null
    ){}
}