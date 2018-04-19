import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TimeSheetComponent } from './timeSheet.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';

const routes: Routes = [{
	path: '',
	data: {
      title: 'Time Sheet Form',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Time Sheet Form'}]
    },
	component: TimeSheetComponent
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
	declarations: [TimeSheetComponent]
})
export class TimeSheetFormModule {

}