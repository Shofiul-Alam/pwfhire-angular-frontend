import {EmployeeOtherDocument} from "./employeeOtherDoc";

export class EmployeeWhiteCard{
    constructor(
        public id: number = 0,
        public name: string = "",
        public employeeOtherDocument: EmployeeOtherDocument = new EmployeeOtherDocument ()
    ){

    }
}

