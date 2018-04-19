import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AddEmployeeComponent } from './addemployee.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';
import { AgmCoreModule } from '@agm/core';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Add Employee',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Add Employee'}]
    },
	component: AddEmployeeComponent
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
	declarations: [AddEmployeeComponent]
})
export class AddEmployeeFormModule {

}