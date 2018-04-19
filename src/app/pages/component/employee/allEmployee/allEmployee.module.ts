import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AlartModule } from './../../alart/alart.module';
import { AllEmployeeComponent } from './allEmployee.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Employees',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Employees'}]
    },
	component: AllEmployeeComponent
}];

@NgModule({
	imports: [
    	FormsModule,
		ReactiveFormsModule,
    	CommonModule,
		NgbModule,
    	RouterModule.forChild(routes),
		Select2Module,
		AlartModule
    ],
	declarations: [AllEmployeeComponent]
})
export class AllEmployeeFormModule {

}