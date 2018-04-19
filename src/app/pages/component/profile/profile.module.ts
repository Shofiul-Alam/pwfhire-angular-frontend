import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientProfileComponent } from './clientPro/clientprofile.component';
import { AdminProfileComponent } from './admin/adminProfile.component';
import { AlartModule } from './../alart/alart.module';
import { AgmCoreModule } from '@agm/core';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Profile',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Profile'}]
    },
	component: ProfileComponent
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
	declarations: [ProfileComponent,ClientProfileComponent, AdminProfileComponent]
})
export class ProfileFormModule {

}