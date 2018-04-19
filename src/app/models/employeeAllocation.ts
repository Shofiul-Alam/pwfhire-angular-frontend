import {Employee} from "./employee";
import {Task} from "./task";
import {AllocatedDates} from "./allocatedDates";

export class EmployeeAllocation {
    constructor(
        public id: number = 0,
        public employee: Employee = new Employee() ,
        public task: Task = new Task(),
        public cancelAll: boolean = null,
        public acceptPartially: boolean = null,
        public acceptAll: boolean = null,
        public requestSendPartially: boolean = null,
        public requestSendAll: boolean = null,
        public sms: string = "",
        public archived: boolean = false,
        public allocatedDates: Array<AllocatedDates> = []
    ){}
}