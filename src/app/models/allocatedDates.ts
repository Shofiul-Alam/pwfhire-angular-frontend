import {EmployeeAllocation} from "./employeeAllocation";
import {CustomDate} from "./customDate";

export class AllocatedDates {
    constructor(
        public id: number = 0,
        public date: CustomDate = new CustomDate(),
        public day: string = "",
        public respond: string = "",
        public cancelallocation: boolean = null,
        public accecptallocation: boolean = null,
        public requestSend: boolean = null,
        public employeeAllocation: EmployeeAllocation = null
    ){}
}