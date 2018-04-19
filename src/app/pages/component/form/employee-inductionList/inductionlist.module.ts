import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InductionListComponent } from './induction.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Employee Induction List'
    },
	component: InductionListComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		Select2Module,
		NgbModule,
		RouterModule.forChild(routes),
		AlartModule
    ],
	declarations: [InductionListComponent],
	exports: [InductionListComponent]
})
export class EmpInductionListModule {

}