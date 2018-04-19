import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SubmittedListComponent } from './submitForm.component';
import { Select2Module } from 'ng2-select2';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Submitted Induction List',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Induction List',url: '/induction-list'},{title: 'Submitted induction Form'}]
    },
	component: SubmittedListComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		Select2Module,
		RouterModule.forChild(routes)
    ],
	declarations: [SubmittedListComponent]
})
export class SubmittedListModule {

}