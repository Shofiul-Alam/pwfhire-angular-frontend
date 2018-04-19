import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AddSkillCompetencyComponent } from './addSkillCompetency.component';
import { AlartModule } from './../../alart/alart.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [{
	path: '',
	data: {
      title: 'Skills & Competencys',
      urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Skill Competency List'}]
    },
	component: AddSkillCompetencyComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes),
		AlartModule,
		NgbModule
    ],
	declarations: [AddSkillCompetencyComponent]
})
export class AddSkillCompetencyModule {

}