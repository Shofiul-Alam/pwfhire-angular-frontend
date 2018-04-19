import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {HttpClientModule} from '@angular/common/http';


const routes: Routes = [{
	path: '',
	data: {
        title: 'Home Page',
        urls: [{title: 'Dashboard'}]
    },
	component: StarterComponent
}];

@NgModule({
	imports: [
    	FormsModule,
		HttpClientModule,
    	CommonModule, 
    	NgbModule,
    	RouterModule.forChild(routes),
		ChartsModule
    ],
	declarations: [StarterComponent]
})
export class StarterModule { }