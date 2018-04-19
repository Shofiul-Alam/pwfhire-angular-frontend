export class AllField {
    constructor(
        public id: number = 0,
        public access: string = null,
        public cssName: string = null,
        public defaultValue: string = null,
        public description: string = null,
        public encryptedId: string = null,
        public inline: string = null,
        public label: string = null,
        public max: string = null,
        public min: string = null,
        public name: string = '',
        public placeholder: string = null,
        public required: string = null,
        public subType: string = null,
        public type: string = null,
        public form: string|{} = '',
        public value: string = null,
        public valueArr: Array<any> = [],
        public values: Array<any> = []
    ){}
}