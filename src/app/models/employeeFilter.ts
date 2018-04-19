

export class EmpListFilter {
    constructor(
    	public firstName:string = null,
        public lastName:string = null,
        public employeeCategory: string = null,
        public email: string = null,
        public address: string = null,
        public approved: string = null
    ){

    }
}