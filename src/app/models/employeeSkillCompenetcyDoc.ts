import {SkillCompetencyList} from "./SkillCompetencyList";
import {Employee} from "./employee";
import {EmployeeSkillDocument} from "./EmployeeSkillDocument";
import {CustomDate} from "./customDate";

export class EmployeeSkillComDoc{
    constructor(
        public id: number = 0,
        public issueDate: CustomDate = new CustomDate(),
        public expiryDate: CustomDate = new CustomDate(),
        public description: string = "",
        public employee: Employee = new Employee(),
        public skillCompetencyList: SkillCompetencyList = new SkillCompetencyList()
    ){

    }
}