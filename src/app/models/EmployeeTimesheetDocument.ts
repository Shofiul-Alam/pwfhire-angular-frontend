import {TimeSheet} from "./timeSheet";

export class EmployeeTimesheetDocument {
    constructor(
        public id: number = 0,
        public alt: string = "",
        public width: string = "",
        public height: string = "",
        public path: string = "",
        public fileName: string = "",
        public mime: string = "",
        public storageType: string = "",
        public size: string = "",
        public uploadedDate: string = "",
        public timeSheet: TimeSheet = new TimeSheet()
    ){}
}