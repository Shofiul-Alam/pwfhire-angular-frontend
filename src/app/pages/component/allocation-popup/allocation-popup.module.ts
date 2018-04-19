import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllAllocationPopUpComponent } from './allocation-popup.component';
import { Select2Module } from 'ng2-select2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';




@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		NgbModule,
		Select2Module
    ],
	declarations: [
		AllAllocationPopUpComponent
	],
	exports: [
        AllAllocationPopUpComponent
    ]
})
export class AllocationPopUpModule {

}