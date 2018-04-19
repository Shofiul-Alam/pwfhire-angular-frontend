import {Induction} from "./Induction";
import {SkillCompetencyList} from "./SkillCompetencyList";

export class Job {
    constructor(
        public id: number = 0,
        public text: string = "",
        public name: string = '',
        public chargeRate: string = "",
        public payscale: string = "",
        public archived: boolean = null,
        public induction:Array <Induction> = null,
        public skillCompetencyList: Array<SkillCompetencyList> = [],
        public splicedInduction: Array<Induction> = null,
        public splicedTask = null,

    ){}
}