import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditProjectComponent } from './editProject.component';
import { EditProjectFormComponent } from './projectform/editProjectForm.component';
import { EditDocComponent } from './documents/doc.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Update Project',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Projects',url: '/projects'},{title: 'Update Project'}]
    },
	component: EditProjectComponent
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
	declarations: [EditProjectComponent, EditProjectFormComponent, EditDocComponent]
})
export class EditProjectModule {

}