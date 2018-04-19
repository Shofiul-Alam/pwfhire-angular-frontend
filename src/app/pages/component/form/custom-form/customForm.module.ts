import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CustomFormComponent } from './customForm.component';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Create/Edit Form',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Form List',url: '/form-list'},{title: 'Custom Form'}]
    },
	component: CustomFormComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes)
    ],
	declarations: [
		CustomFormComponent
	]
})
export class CustomFormModule {

}