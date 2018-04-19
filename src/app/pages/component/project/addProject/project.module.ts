import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectFormComponent } from './project.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';
import { AgmCoreModule } from '@agm/core';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Add Project',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Add Project'}]
    },
	component: ProjectFormComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule, 
    	NgbModule,
    	RouterModule.forChild(routes),
		AlartModule,
		Select2Module,
    AgmCoreModule.forRoot({
          apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
      })
    ],
	declarations: [ProjectFormComponent]
})
export class ProjectModule {

}