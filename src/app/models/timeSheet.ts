import {Employee} from './employee';
import {CustomDate} from './customDate';
import {CustomTime} from './customTime';
import {AllocatedDates} from "./allocatedDates";
import {EmployeeTimesheetDocument} from "./EmployeeTimesheetDocument";

export class TimeSheet{
    constructor(
        public id: number = 0,
        public date: CustomDate = new CustomDate,
        public startTime: CustomTime = new CustomTime,
        public finishTime: CustomTime = new CustomTime,
        public breakTime: string = "",
        public hoursWorked: string = "",
        public weekDay:string = "",
        public weekend:string = "",
        public overtime:string = "",
        public workerTimesheetInstructions:string = "",
        public clientTimesheetInstruction:string = "",
        public approved:boolean = false,
        public employee: Employee = new Employee(),
        public employeeTimesheetDocument:any = null,
        public allocatedDates: AllocatedDates = new AllocatedDates()
    ){

    }
}
