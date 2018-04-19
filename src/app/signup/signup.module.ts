import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import {FormsModule} from "@angular/forms";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeComponent } from './employee/employee.component';
import { ClientComponent } from './client/client.component';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [SignupComponent, EmployeeComponent, ClientComponent]
})
export class SignupModule { }
