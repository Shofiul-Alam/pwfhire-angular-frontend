import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FormListComponent } from './formList.component';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Form List',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Form List'}]
    },
	component: FormListComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes)
    ],
	declarations: [FormListComponent],
	exports: [FormListComponent]
})
export class FormListModule {

}