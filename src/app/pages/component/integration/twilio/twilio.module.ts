import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TwilioComponent } from './twilio.component';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Twilio Form',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Twilio Form'}]
    },
	component: TwilioComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule,
      AlartModule,
    	RouterModule.forChild(routes)
    ],
	declarations: [TwilioComponent]
})
export class TwilioModule {

}