import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EditEmployeeComponent } from './editemployee.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Update Employee',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Employees',url: '/employees'},{title: 'Update Employee'}]
    },
	component: EditEmployeeComponent
}];

@NgModule({
	imports: [
    	FormsModule,
		ReactiveFormsModule,
    	CommonModule, 
    	NgbModule,
    	RouterModule.forChild(routes),
		Select2Module,
    AlartModule,
		AgmCoreModule.forRoot({
      		apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
    	})
    ],
	declarations: [EditEmployeeComponent]
})
export class EditEmployeeFormModule {

}