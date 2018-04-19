import {Job} from "./Job";


export class SkillCompetencyList {
    constructor(
        public id: number | string = 0,
        public name: string = "",
        public job: Array<Object> = new Array(),
        public text: string = name
    ){}
}