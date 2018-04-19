
import {CustomDate} from "./customDate";


export class TaskFilter {
    constructor(
        public taskName: string = null,
        public startDate: CustomDate = null,
        public endDate: CustomDate = null,
        public startTime: string = null,
        public endTime: string =null,
        public job: string = null
    ){}
}