import {EmployeeCategory} from "./employee_category";
import {EmployeeOrderCategory} from "./employeeOrderCategory";
import {User} from "./user";
import {EmployeeIdCard} from "./employeeIdCard";
import {EmployeeVisa} from "./employeeVisa";
import {EmployeeWhiteCard} from "./employeeWhiteCard";
import {CustomDate} from "./customDate";
import {UserDeclearation} from "./userDeclearation";
import {EmployeeSkillComDoc} from "./employeeSkillCompenetcyDoc";

export class Employee{
    constructor(
        public id: number = 0,
        public dob: CustomDate = new CustomDate(),
        public address: string = "",
        public lattitude: number = 0,
        public longitude: number = 0,
        public nationality: string = "",
        public emergencyContactName: string = "",
        public emergencyContactMobile: string = "",
        public bankName:string = "",
        public bankBsb:string = "",
        public bankAccountNo:string = "",
        public tfnNo: string = "",
        public abnNo:string = null,
        public superannuationName: string = "",
        public superannuationNo: string = "",
        public approved: boolean = false,
        public archived: boolean = false,
        public user:User = new User(),
        public employeeSkillCompentency:Array<EmployeeSkillComDoc> = [],
        public employeeCategory:EmployeeCategory = new EmployeeCategory(),
        public employeeIdCard: EmployeeIdCard = new EmployeeIdCard(),
        public employeeOrderCategory:EmployeeOrderCategory = new EmployeeOrderCategory(),
        public employeeVisa: EmployeeVisa = new EmployeeVisa(),
        public employeeWhiteCard: EmployeeWhiteCard = new EmployeeWhiteCard(),
        public userDeclearation: UserDeclearation = new UserDeclearation()
    ){

    }
}