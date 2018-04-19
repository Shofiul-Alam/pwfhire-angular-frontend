import {Project} from "./project";

export class ProjectUploadDoc {
    constructor(
        public id: number = 0,
        public title: string = "",
        public description: string = "",
        public project: Project = new Project()
    ){

    }
}