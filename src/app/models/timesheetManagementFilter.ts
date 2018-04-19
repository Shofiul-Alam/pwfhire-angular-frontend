
import {CustomDate} from "./customDate";


export class AdminTimesheetFilter {
    constructor(
    	public employee: string = null,
        public task: string = null,
        public client: string = null,
        public project: string = null,
        public order: string = null,
        public approve: string = null,
        public startDate: CustomDate = null,
        public endDate: CustomDate = null,
        public startTime: string = null,
        public endTime: string =null
    ){}
}