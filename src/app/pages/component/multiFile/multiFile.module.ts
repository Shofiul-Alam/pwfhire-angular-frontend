import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MultiFileComponent } from './multiFile.component';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Time Sheet Form',
      urls: [{title: 'Dashboard',url: '/'},{title: 'Time Sheet Form'}]
    },
	component: MultiFileComponent
}];

@NgModule({
	imports: [
    	FormsModule,
    	CommonModule,
    	RouterModule.forChild(routes)
    ],
	declarations: [MultiFileComponent]
})
export class MultiFileModule {

}