
import {SkillCompetencyList} from "./SkillCompetencyList";

export class AllocationFilter {
    constructor(
        public lastName:string = null,
        public skillCompetencyList: Array<SkillCompetencyList> = null,
        public ratting: string = null
    ){

    }
}