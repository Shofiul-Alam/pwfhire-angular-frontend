import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmpOrderCategoryComponent } from './job.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Position',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Position'}]
    },
	component: EmpOrderCategoryComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes),
		Select2Module,
		AlartModule,
		NgbModule
    ],
	declarations: [EmpOrderCategoryComponent]
})
export class EmpOrdercategoryModule {

}