
export class ClientFilter {
    constructor(
        public companyName: string = null,
        public companyAbnNo: string = null,
        public email: string = null,
        public companyAcn: string = null,
        public companyTfn: string = null,
        public landlineNo: string = null,
        public allocatedContact:Array<string> = null
    ){

    }
}