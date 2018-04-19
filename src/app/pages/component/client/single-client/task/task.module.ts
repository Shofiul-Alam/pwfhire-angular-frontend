import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AllTaskComponent } from './task.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { AlartModule } from './../../../alart/alart.module';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Single Client',
      urls: [{title: 'Client',url: '/clients'},{title: 'Project',url: '/single-client'},{title: 'Order',url: '/single-client-project'},{title: 'Tasks'}]
    },
	component: AllTaskComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgbModule,
		RouterModule.forChild(routes),
		Select2Module,
		AlartModule,
		AgmCoreModule.forRoot({
      		apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
    	})
    ],
	declarations: [
		AllTaskComponent
	]
})
export class SingleClientTaskModule {

}