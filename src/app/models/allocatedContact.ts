import {Contact} from "./contact";
import {Client} from "./client";
import {Project} from "./project";
import {Order} from "./order";

export class AllocatedContact {
    constructor(
        public id:string = '',
        public contact:Contact = new Contact(),
        public client: Client = new Client(),
        public project: Project = new Project(),
        public order: Order = new Order(),

    ){

    }
}