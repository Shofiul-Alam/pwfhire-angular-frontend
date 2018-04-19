import {CustomDate} from "./customDate";

export class EmployeeOtherDocument{
    constructor(
        public id: number = 0,
        public alt: string = "",
        public width: string = "",
        public height: string = "",
        public path: string = "",
        public fileName: string = "",
        public mime:string = "",
        public storageType:string = "",
        public size:string = "",
        public uploadedDate: CustomDate = new CustomDate(),
        public text: string = ''
    ){

    }
}
