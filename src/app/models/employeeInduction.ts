import {Induction} from "./Induction";
import {Employee} from "./employee";
import {EmployeeSkillDocument} from "./EmployeeSkillDocument";

export class EmployeeInduction{
    constructor(
        public id: number = 0,
        public description: string = "",
        public employeeSkillDocument: EmployeeSkillDocument = new EmployeeSkillDocument(),
        public induction: Induction = new Induction(),
        public employee: Employee = new Employee()
    ){

    }
}