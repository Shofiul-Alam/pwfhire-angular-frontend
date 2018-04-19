import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmpAllocationComponent } from './empAllocation.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Employee Allocation',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Employee Allocation'}]
    },
	component: EmpAllocationComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule,
		NgbModule,
    	RouterModule.forChild(routes),
		Select2Module
    ],
	declarations: [EmpAllocationComponent]
})
export class EmpAllocationModule {

}