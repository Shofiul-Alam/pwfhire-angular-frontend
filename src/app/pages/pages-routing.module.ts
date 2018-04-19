import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './pages.component';
import { AdminGuard } from '../shared/guard/admin.guard';
import { ClientGuard } from '../shared/guard/client.guard';
import { EmployeeGuard } from '../shared/guard/empolyee.guard';


const routes: Routes = [
    {
        path: '', component: PageComponent,
        children: [
            { path: 'dashboard', loadChildren: './starter/starter.module#StarterModule' },

            { path: 'addclient', loadChildren: './component/client/addClient/addclient.module#AddClientFormModule', canActivateChild: [AdminGuard] },
            { path: 'edit-client', loadChildren: './component/client/editClient/editClient.module#EditClientFormModule', canActivateChild: [AdminGuard] },
            { path: 'clients', loadChildren: './component/client/allClient/clientList.module#ClientList', canActivateChild: [AdminGuard] },
            { path: 'single-client', loadChildren: './component/client/single-client/project/project.module#SingleClientProjectModule', canActivateChild: [AdminGuard] },
            { path: 'single-client-project', loadChildren: './component/client/single-client/order/order.module#SingleClientOrderModule', canActivateChild: [AdminGuard] },
            { path: 'single-client-order', loadChildren: './component/client/single-client/task/task.module#SingleClientTaskModule', canActivateChild: [AdminGuard] },
            { path: 'single-client-task', loadChildren: './component/client/single-client/allocation/allocation.module#SingleClientAllocationModule', canActivateChild: [AdminGuard] },
            
            { path: 'addemployee', loadChildren: './component/employee/addEmployee/addemployee.module#AddEmployeeFormModule', canActivateChild: [AdminGuard] },
            { path: 'edit-employee', loadChildren: './component/employee/editEmployee/editemployee.module#EditEmployeeFormModule', canActivateChild: [AdminGuard] },
            { path: 'employee-allocation', loadChildren: './component/employee/empAllocation/empAllocation.module#EmpAllocationModule', canActivateChild: [AdminGuard] },
            { path: 'employees', loadChildren: './component/employee/allEmployee/allEmployee.module#AllEmployeeFormModule', canActivateChild: [AdminGuard] },

            { path: 'addproject', loadChildren: './component/project/addProject/project.module#ProjectModule', canActivateChild: [ClientGuard] },
            { path: 'edit-project', loadChildren: './component/project/editProject/editProject.module#EditProjectModule', canActivateChild: [ClientGuard] },
            { path: 'projects', loadChildren: './component/project/allProject/project.module#AllProjectModule', canActivateChild: [ClientGuard] },

            { path: 'addorder', loadChildren: './component/order/addOrder/order.module#OrderFormModule', canActivateChild: [ClientGuard] },
            { path: 'orders', loadChildren: './component/order/allOrder/order.module#OrderFormModule', canActivateChild: [ClientGuard] },
            { path: 'order-task', loadChildren: './component/order/single-order/task/task.module#SingleOrderTaskModule', canActivateChild: [AdminGuard] },
            { path: 'order-allocation', loadChildren: './component/order/single-order/allocation/allocation.module#SingleOrderAllocationModule', canActivateChild: [AdminGuard] },
            
            { path: 'my-profile-details', loadChildren: './component/only-employee/profile/empprofile.module#EmpProfileFormModule' },
            { path: 'profile', loadChildren: './component/profile/profile.module#ProfileFormModule'},

            { path: 'create-form', loadChildren: './component/form/custom-form/customForm.module#CustomFormModule' },
            { path: 'form-list', loadChildren: './component/form/formList/formlist.module#FormListModule' },
            { path: 'induction-list', loadChildren: './component/form/inductionList/inductionlist.module#InductionListModule' },
            { path: 'submitted-induction', loadChildren: './component/form/submitted-induction/submitForm.module#SubmittedListModule' },
            { path: 'submitted-form', loadChildren: './component/form/submitted-form/submitForm.module#SubmittedFormModule' },

            { path: 'add-timesheet', loadChildren: './component/timeSheet/timeSheet/timeSheet.module#TimeSheetFormModule'},
            { path: 'timeSheets', loadChildren: './component/timeSheet/allTimeSheet/timeSheetList.module#TimeSheetListModule'},

            { path: 'twilio', loadChildren: './component/integration/twilio/twilio.module#TwilioModule'},

            
            { path: 'position', loadChildren: './component/setting/job/job.module#EmpOrdercategoryModule', canActivateChild: [AdminGuard] },
            { path: 'skill-competency-list', loadChildren: './component/setting/skillCompetency/addSkillCompetency.module#AddSkillCompetencyModule', canActivateChild: [AdminGuard] },

            
            { path: 'emp-form-list', loadChildren: './component/form/employee-formList/formlist.module#EmpFormListModule' },
            { path: 'emp-induction-list', loadChildren: './component/form/employee-inductionList/inductionlist.module#EmpInductionListModule' },
           
            { path: 'new-pending-job', loadChildren: './component/only-employee/job-allocation/new/new.module#NewJobModule' },
            { path: 'accepted-job', loadChildren: './component/only-employee/job-allocation/accepted/accepted.module#AcceptedModule' },
            { path: 'emp-timeSheet', loadChildren: './component/only-employee/timeSheet/timeSheetList.module#EmpTimeSheetListModule'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
