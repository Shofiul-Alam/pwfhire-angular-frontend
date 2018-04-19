import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpProfileComponent } from './empprofile.component';

import { AlartModule } from './../../alart/alart.module';
import { AgmCoreModule } from '@agm/core';


const routes: Routes = [{
	path: '',
	data: {
      title: 'My Profile'
    },
	component: EmpProfileComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule,
		NgbModule.forRoot(),
    	RouterModule.forChild(routes),
		Select2Module,
		AlartModule,
		AgmCoreModule.forRoot({
      		apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
    	})
		
    ],
	declarations: [EmpProfileComponent]
})
export class EmpProfileFormModule {

}