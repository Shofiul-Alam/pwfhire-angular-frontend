import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Employee } from './../../models/employee';
import { UserType } from './../../models/UserType';
import { User } from './../../models/User';
import { ValidationService } from './../../services/formValidation.service';
import { EmployeeService } from './../../services/employee.service';



@Component({
    selector: 'employee-signup',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit, AfterViewInit {

    public title: string;
    public employee: Employee;
    public status;
    public checkPass:string = '';
    public checkboxTerm: boolean = false;
    code;
    loader: boolean = false;

    constructor(
        private validationForm: ValidationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _employeeService: EmployeeService
    ){
        this.title = "Register";
        var userType = new UserType(0, "employee");
        this.employee = new Employee();
        this.employee.user.userType = userType;

    }

    ngAfterViewInit() {
        $(function() {
            $(".preloader").fadeOut();
        });
    }

    ngOnInit() {
        this.validationForm.floatLabel();
    }



    onSubmit() {
        this.employee.longitude=null;
        this.employee.lattitude = null;
        // console.log(this.employee);
        this.loader = true;
        this._employeeService.register(this.employee).subscribe(
            response => {
                this.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.status = response.msg;
                    this.loader = false;
                    setTimeout(()=>{this.code = 0},10000);
                } else{
                    this.loader = false;
                }
            },
            error => {
                console.log(<any> error);
                this.loader = false;
            }
        );
    }

    cancelPopUp(){
        this.code = 0;
    }



}
