import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SubmittedFormComponent } from './submitForm.component';
import { Select2Module } from 'ng2-select2';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Submitted Form List',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Form List',url: '/form-list'},{title: 'Submitted Form List'}]
    },
	component: SubmittedFormComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		Select2Module,
		RouterModule.forChild(routes)
    ],
	declarations: [SubmittedFormComponent]
})
export class SubmittedFormModule {

}