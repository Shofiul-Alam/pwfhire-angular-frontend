import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AllProjectComponent } from './project.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../../alart/alart.module';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Single Client',
      urls: [{title: 'Client',url: '/clients'},{title: 'Projects'}]
    },
	component: AllProjectComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgbModule,
		RouterModule.forChild(routes),
		Select2Module,
		AlartModule
    ],
	declarations: [
		AllProjectComponent
	]
})
export class SingleClientProjectModule {

}