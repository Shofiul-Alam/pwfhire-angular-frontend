import { Component, OnInit, Input,AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './../../../../services/user.service';
import {EmployeeManagementService} from './../../../../services/admin/employeeManagement.service';
import { User } from './../../../../models/user';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Employee } from './../../../../models/employee';
import { ValidationService } from './../../../../services/formValidation.service';
import {UserType} from "../../../../models/UserType";
import {UploadService} from "../../../../services/upload.service";
import {APIServices} from "../../../../services/apiServices.service";
import {UserDeclearation} from "../../../../models/userDeclearation";
import {ExtraData} from './../../../../models/extraData';




@Component({
    selector: 'employee-addForm',
    templateUrl: 'addemployee.component.html',
    providers: [NgbDatepickerConfig]
})
export class AddEmployeeComponent implements OnInit,AfterViewInit {
    public countryList = [];
    public user:User;
    public checkPass: string;
    public extra:ExtraData;
    public filesToUpload: Array<File>;
    avatar:any;
    public userDeclearation:UserDeclearation;
    

   public get employee():Employee {
        return this._empservice.employee;
    }
   public set employee(value: Employee) {
        this._empservice.employee = value;
    }

    @ViewChild('address') public searchElement: ElementRef;

    constructor(
        public validationForm: ValidationService,
        private _empservice: EmployeeManagementService,
        private router: Router,
        config: NgbDatepickerConfig,
        private _uploadService: UploadService,
        private apiService: APIServices
    ){

        this.checkPass = '';
        this.extra = new ExtraData();
        config.minDate = {year: 1950, month: 1, day: 1};
        config.maxDate = {year: 2099, month: 12, day: 31};
    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.validationForm.floatLabel();
        this._uploadService.avatarUpload();
        this.getCountryList(); 
        this.getAddress();
        this.userDeclearation = new UserDeclearation();
    }

    ngAfterViewInit(){
        setTimeout(()=>{this.initAddEmployee()},100);
    }

    getAddress(){
        this.apiService.addressAutoComplete(this.searchElement.nativeElement);
    }

    getCountryList(){
        this._empservice.getCounrt().subscribe(
            res => this.countryList = res
        );
    }

    countryChange(data:{value: string[]}){
        setTimeout(()=>{
            this.employee.nationality = this._empservice.getCountryFromSelect(this.countryList,data.value);
            // console.log(this.employee.nationality);
        },100);
    }

    initAddEmployee(){
        this.employee = new Employee();
        let userType = new UserType(0, "employee");
        this.employee.user.userType = userType;
        window.sessionStorage.removeItem('address');
    }

    getEmpAddress(){
        let address = JSON.parse(sessionStorage.getItem('address'));
        if(address!=null){
          this.employee.address = address.address;
          this.employee.lattitude = address.lat;
          this.employee.longitude = address.lng;
        }
    }

    onSubmit(f){  
        this.getEmpAddress();  
        this.extra.loader = true;
        // console.log(this.employee,this.avatar,this.employee.address,this.userDeclearation);
        this._empservice.addDataWithAvatar(this.employee,this.avatar, this.userDeclearation).subscribe(
            response => {
                this.extra.code = response.code;
              // console.log(response);
              if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
              } else {
                  this.validationForm.successRes(response,f,this.extra);
                  window.sessionStorage.removeItem('address');
                  this.employee = response.Employee;
                  let date = this.validationForm.convertToCustomDate(response.Employee.dob);
                  this.employee.dob = date;
                  this.router.navigate(['/edit-employee']);
              }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
    }
    

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        // console.log(this.filesToUpload);
        let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
        this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
            (result) => {
                this.avatar = result['upload'];
                // console.log(result['upload']);
            },
            (error) => {
                console.log(error);
            });
    }

}


