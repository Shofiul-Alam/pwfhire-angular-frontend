import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { AdminGuard } from './shared/guard/admin.guard';
import { EmployeeGuard } from './shared/guard/empolyee.guard';
import { ClientGuard } from './shared/guard/client.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StarterService } from './pages/starter/starter.service';
import { AuthService } from './shared/guard/authService.service';
import { UserService } from './services/user.service';
import { EmployeeService } from './services/employee.service';
import { ClientService } from './services/client.service';
import { ValidationService } from './services/formValidation.service';
import { JobService } from './services/admin/job.service';
import { AdminEmployeeService } from './services/admin/adminEmployee.service';
import { AdminService } from './services/admin/admin.service';
import { ClientManagment } from './services/admin/clientManagement.service';
import { EmployeeManagementService } from './services/admin/employeeManagement.service';
import { CommonService } from './services/common.service';
import { SkillCompetencyManagement } from './services/admin/adminSkillCompetency.service';
import { ContactManagment } from './services/admin/contactManagement.service';
import { UploadService } from './services/upload.service';
import { ExportCSV } from './services/exportCSV.service';
import { ProjectManagement } from './services/admin/projectManagement.service';
import { ImagePopUpService } from './services/imagePopUp.service';
import { FormService } from './services/admin/adminForm.service';
import { AdminOrderService } from './services/admin/adminOrder.service';
import { AdminTaskService } from './services/admin/adminTask.service';
import { FormMethodsService } from './services/formMethods.service';
import { InductionService } from './services/admin/adminInduction.service';
import { APIServices } from './services/apiServices.service';
import { AdminTimesheetService } from './services/admin/adminTimesheet.service';
import { AllocationManagement } from './services/admin/allocationManagement.service';
import { PermissionManagement } from './services/admin/permissionManagement.service';
import { IntegrationManagement } from './services/admin/integrationManagement.service';
import { AllocationService } from './services/allocations.service';
import { EmployeeInductionsService } from './services/inductions.service';
import { EmployeeDocumentService } from './services/employeeDocument.service';
import { EmployeeTimesheetService } from './services/employeeTimesheet.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
          apiKey: 'AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0', libraries: ['places'] 
      })
  ],
  providers: [
      AuthGuard,
      AdminGuard,
      ClientGuard,
      EmployeeGuard,
      StarterService,
      AuthService,
      UserService,
      EmployeeService,
      ClientService,
      ValidationService,
      JobService,
      AdminEmployeeService,
      AdminService,
      EmployeeManagementService,
      ClientManagment,
      CommonService,
      SkillCompetencyManagement,
      UploadService,
      ContactManagment,
      ExportCSV,
      ProjectManagement,
      ImagePopUpService,
      FormService,
      FormMethodsService,
      AdminOrderService,
      AdminTaskService,
      InductionService,
      APIServices,
      AdminTimesheetService,
      AllocationManagement,
      AllocationService,
      PermissionManagement,
      IntegrationManagement,
      EmployeeInductionsService,
      EmployeeDocumentService,
      EmployeeTimesheetService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
