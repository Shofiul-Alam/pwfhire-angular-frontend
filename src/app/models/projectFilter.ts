
import {CustomDate} from "./customDate";

export class ProjectFilter {
    constructor(
        public client:string = null,
        public projectName: string = null,
        public projectAddress: string = null,
        public before: CustomDate = null,
        public after: CustomDate = null
    ){

    }
}