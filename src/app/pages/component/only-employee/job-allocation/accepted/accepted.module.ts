import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AcceptedComponent } from './accepted.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../../alart/alart.module';




const routes: Routes = [{
	path: '',
	data: {
      title: 'Job/Allocation'
      // urls: [{title: 'Dashboard',url: '/'},{title: 'Single Client'}]
    },
	component: AcceptedComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgbModule,
		AlartModule,
		RouterModule.forChild(routes)
    ],
	declarations: [
		AcceptedComponent
	]
})
export class AcceptedModule {

}