import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AlartModule } from './../../alart/alart.module';
import { ClientListComponent } from './clientList.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Clients',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Clients'}]
    },
	component: ClientListComponent
}];

@NgModule({
	imports: [
    	FormsModule,
		ReactiveFormsModule,
    	CommonModule, 
    	RouterModule.forChild(routes),
		Select2Module,
		NgbModule,
		AlartModule
    ],
	declarations: [ClientListComponent]
})
export class ClientList {

}