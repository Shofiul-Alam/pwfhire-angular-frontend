import {User} from './user';
import {Induction} from './Induction';

export class UserSubmittedInduction{
    constructor(
        public id: number = 0,
        public induction: Induction = new Induction(),
        public user: User = new User()
    ){

    }
}