import {Order} from "./order";
import {Job} from "./Job";
import {CustomDate} from "./customDate";
import {CustomTime} from "./customTime";

export class Task {
    constructor(
        public id: number = 0,
        public taskName: string = "",
        public startDate: CustomDate = new CustomDate(),
        public endDate: CustomDate = new CustomDate(),
        public startTime: CustomTime = new CustomTime(),
        public endTime: CustomTime = new CustomTime(),
        public chargeRate: string = "",
        public payRate: string = "",
        public numberOfEmployees: string = "0",
        public order: Order = new Order(),
        public job: Job = new Job(),
        public archived: boolean = null,
    ){}
}