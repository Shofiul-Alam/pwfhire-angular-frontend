import {User} from "./user";

export class UserDeclearation {
    constructor(
        public id: number = 0,
        public isIslander: boolean = false,
        public isAboriginal: boolean = false,
        public hasDoneCrime: boolean = false,
        public crimeDetails: string = "",
        public user:User = new User()
    ){

    }
}