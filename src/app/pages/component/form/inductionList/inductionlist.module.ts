import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InductionListComponent } from './induction.component';
import { Select2Module } from 'ng2-select2';
import { AlartModule } from './../../alart/alart.module';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Induction List',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Induction List'}]
    },
	component: InductionListComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		Select2Module,
		RouterModule.forChild(routes),
		AlartModule
    ],
	declarations: [InductionListComponent],
	exports: [InductionListComponent]
})
export class InductionListModule {

}