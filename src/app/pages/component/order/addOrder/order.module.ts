import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';
import { AgmCoreModule } from '@agm/core';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Add Order',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Add Order'}]
    },
	component: OrderComponent
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
	declarations: [OrderComponent]
})
export class OrderFormModule {

}