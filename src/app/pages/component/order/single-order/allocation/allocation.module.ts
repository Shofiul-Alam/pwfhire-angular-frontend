import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AllAllocationComponent } from './allocation.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { AlartModule } from './../../../alart/alart.module';
import { AllocationPopUpModule } from './../../../allocation-popup/allocation-popup.module';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Single Order',
      urls: [{title: 'Single Order',url: '/orders'},{title: 'Single Task',url: '/order-task'},{title: 'Allocations'}]
    },
	component: AllAllocationComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgbModule,
		RouterModule.forChild(routes),
		Select2Module,
		AlartModule,
		AllocationPopUpModule,
		AgmCoreModule.forRoot({
      		apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
    	})
    ],
	declarations: [
		AllAllocationComponent
	]
})
export class SingleOrderAllocationModule {

}