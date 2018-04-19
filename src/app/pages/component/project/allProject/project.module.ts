import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllProjectComponent } from './project.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'All Project',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'All Project'}]
    },
	component: AllProjectComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule, 
    	NgbModule,
    	RouterModule.forChild(routes),
		AlartModule,
		Select2Module
    ],
	declarations: [AllProjectComponent]
})
export class AllProjectModule {

}