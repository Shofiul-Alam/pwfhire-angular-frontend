import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EditClientComponent } from './editClient.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Update Client',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Clients',url: '/clients'},{title: 'Update Client'}]
    },
	component: EditClientComponent
}];

@NgModule({
	imports: [
    	FormsModule,
		ReactiveFormsModule,
    	CommonModule, 
    	NgbModule,
    	RouterModule.forChild(routes),
		Select2Module,
    AlartModule
    ],
	declarations: [EditClientComponent]
})
export class EditClientFormModule {

}