import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddClientComponent } from './addclient.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Add Client',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Add Client'}]
    },
	component: AddClientComponent
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
	declarations: [AddClientComponent]
})
export class AddClientFormModule {

}