import {Client} from "./client";

export class ClientUploadDoc {
    constructor(
        public id: number = 0,
        public title: string = "",
        public description: string = "",
        public client: Client = new Client()
    ){

    }
}
