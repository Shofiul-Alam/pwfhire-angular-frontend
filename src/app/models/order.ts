import {Project} from "./project";
import {Contact} from "./contact";
import {CustomDate} from "./customDate";
import {AllocatedContact} from "./allocatedContact";

export class Order {
    constructor(
        public id: string = "",
        public projectDetails: string = "",
        public orderTitle: string = "",
        public startDate: CustomDate = new CustomDate(),
        public endDate: CustomDate = new CustomDate(),
        public orderStatus: string = "",
        public orderDescription: string = "",
        public contactDetails: Array<Contact> = [],
        public comments: string = "",
        public tasksReferenceId: string = "",
        public project: Project = new Project(),
        public allocatedContact: Array<AllocatedContact> = [],
        public splicedAllocatedContact: Array<AllocatedContact> = null,
        public firstTime: boolean = null,
        public archived: boolean = false,
    ){

    }
}