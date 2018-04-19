import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TimeSheetListComponent } from './timeSheetList.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Timesheets',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Timesheets'}]
    },
	component: TimeSheetListComponent
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
	declarations: [TimeSheetListComponent]
})
export class TimeSheetListModule {

}