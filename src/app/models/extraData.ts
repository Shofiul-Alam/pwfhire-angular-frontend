
export class ExtraData {
    constructor(
        public code: number = 0,
        public status: string = "",
        public imgName: string = "",
        public editTrue: boolean = false,
        public editAvatar: boolean = false,
        public loader: boolean = false,
        public loaderadd: boolean = false,
        public con: boolean = false,
        public pro: boolean = false,
        public tsk: boolean = false,
        public fileLoad: boolean = false,
        public modalEl: any = null,
        public modalElOpen:any = null,
        public index: number = 0
    ){

    }
}