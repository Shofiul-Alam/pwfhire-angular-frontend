export class EmpAlloFilter{
	constructor(
			public client:string = null,
			public project:string = null,
			public order:string = null,
			public task:string = null,
			public date:string = null,
			public sort:string = null
		){}
}