import {Project} from "./project";
import {Induction} from "./Induction";

export class AllocatedInduction {
    constructor(
        public id:string = '',
        public project: Project = new Project(),
        public induction: Induction = new Induction(),

    ){

    }
}