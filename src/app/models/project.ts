import {Client} from "./client";
import {AllocatedContact} from "./allocatedContact";
import {AllocatedSkillCompetency} from "./allocatedSkillCompetency";
import {AllocatedInduction} from "./allocatedInduction";

export class Project {
    constructor(
        public id: number = 0,
        public projectName: string = "",
        public projectAddress: string = "",
        public lattitude: number = 0,
        public longitude: number = 0,
        public projectRatesRules: string = "",
        public allocatedContact: Array<AllocatedContact> = [],
        public allContacts: Array<AllocatedContact> = [],
        public allocatedSkillCompetency: Array<AllocatedSkillCompetency> = [],
        public allocatedInduction: Array<AllocatedInduction> = [],
        public client: Client = new Client(),
        public firstTime: boolean = null,
        public archived: boolean = false,
    ){

    }
}

