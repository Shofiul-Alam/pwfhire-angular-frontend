import {Form} from './Form'


export class SubmittedInduction{
	constructor(
		public id:number = 0,
		public name:string = '',
		public form:Form = new Form()
	){}
}