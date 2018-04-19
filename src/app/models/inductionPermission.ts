import {Employee} from "./employee";
import {Induction} from "./Induction";

export class InductionPermission {
    constructor(
        public id: number = 0,
        public employee:Employee = new Employee(),
        public induction:Induction = new Induction()
    ){}
}