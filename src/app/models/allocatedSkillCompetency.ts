import {Project} from "./project";
import {SkillCompetencyList} from "./SkillCompetencyList";

export class AllocatedSkillCompetency {
    constructor(
        public id:number = 0,
        public skillCompetencyList: SkillCompetencyList = null,
        public project: Project = null
    ){

    }
}