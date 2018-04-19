import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EmpTimeSheetListComponent } from './timeSheetList.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlartModule } from './../../alart/alart.module';


const routes: Routes = [{
	path: '',
	data: {
      title: 'Timesheets',
      urls: [{title: 'Timesheets'}]
    },
	component: EmpTimeSheetListComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule,
		NgbModule,
		AlartModule,
    	RouterModule.forChild(routes),
		Select2Module
    ],
	declarations: [EmpTimeSheetListComponent]
})
export class EmpTimeSheetListModule {

}