import {EmployeeOtherDocument} from "./employeeOtherDoc";

export class EmployeeVisa{
    constructor(
        public id: number = 0,
        public issueDate: string = "",
        public expiryDate: string = "",
        public employeeOtherDocument: EmployeeOtherDocument = new EmployeeOtherDocument()
    ){

    }
}
