import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import {Router} from '@angular/router';
import { Select2OptionData } from 'ng2-select2';
import { Employee } from './../../../../models/employee';
import { EmployeeCategory } from './../../../../models/employee_category';
import { ValidationService } from './../../../../services/formValidation.service';
import { EmployeeManagementService } from './../../../../services/admin/employeeManagement.service';
import {UserType} from "../../../../models/UserType";
import { ExportCSV } from './../../../../services/exportCSV.service';
import {APIServices} from "../../../../services/apiServices.service";
import { CommonService } from './../../../../services/common.service';
import {UserDeclearation} from "../../../../models/userDeclearation";
import {ExtraData} from "./../../../../models/extraData";
import {Pagination} from "./../../../../models/pagination";
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {EmpListFilter} from "./../../../../models/employeeFilter";


@Component({
  selector: 'employees',
  templateUrl: 'allEmployee.component.html',
  styleUrls: ['allEmployee.component.css']
})
export class AllEmployeeComponent implements OnInit, AfterViewInit {
  public exampleData: Array<Select2OptionData>;
  public options: Select2Options;
  public nationality: string[];
  public employeeCatagory:EmployeeCategory;
  public employeeList: Array<Employee>;
  public mainEmployeeList:Array<Employee> =[];
  public avatar:any;
  checkPass:string =''; employeeName:string = '';
  public countryList = [];
  public userDeclearation:UserDeclearation;
  approval: string ='';
  public extra:ExtraData;
  public pagination:Pagination;
  public empFilter:EmpListFilter;


  public get employee():Employee {
    return this._empManagementService.employee;
  }
  public set employee(value: Employee) {
    this._empManagementService.employee = value;
  }

  @ViewChild('address') public searchElement: ElementRef;

  constructor(
      public validationForm: ValidationService,
      private _empManagementService: EmployeeManagementService,
      private router: Router,
      private _export: ExportCSV,
      config: NgbDatepickerConfig,
      private _rootNode: ElementRef,
      private apiService: APIServices,
      public  commonService: CommonService
    ) {
      this.employeeCatagory = new EmployeeCategory();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      config.minDate = {year: 1950, month: 1, day: 1};
      config.maxDate = {year: 2099, month: 12, day: 31};
      this.init();
  }

  private init(){
    this.userDeclearation = new UserDeclearation();
    this.employee = new Employee(); 
    this.empFilter = new EmpListFilter();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCountryList(); 
    this.getAddress();
    this.options = {
      multiple: true
    }
    this.getAllEmployee();

    let userType = new UserType(0, "employee");
    this.employee.user.userType = userType;
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#changeData');
  }

  loadPage(page: number) {
    // console.log(page);
    this.pagination.page = page;
    this.getAllEmployee();
  }

  getAllEmployee() {
    // console.log(this.pagination.page );
    this._empManagementService.getUser(this.pagination.page).subscribe(
        response => {
          this.employeeList = response.data;
          this.pagination.total_items_count = response.total_items_count;
          this.pagination.pageSize = response.items_per_page;
          // console.log(response);
    },
        error => {
          console.log(<any> error)
        }
    );
  }

  getAddress(){
        this.apiService.addressAutoComplete(this.searchElement.nativeElement);
    }

    getCountryList(){
        this._empManagementService.getCounrt().subscribe(
            res => this.countryList = res
        );
    }

    countryChange(data:{value: string[]}){
        // console.log(data.value);
        setTimeout(()=>{
            this.employee.nationality = this._empManagementService.getCountryFromSelect(this.countryList,data.value);
            // console.log(data.value,this.employee.nationality);
        },100);
    }


  downloadCSV(){
    let emp = this._empManagementService.formatEmpCSV(this.employeeList);
    this._export.downloadCSV({ filename: "Employee-Data-Table.csv", title:'Employee List' }, emp);
  }


  categoryShow(data){
    if (data == null || data==''){
      return "";
    }
    return data.categoryName;
  }

  getEmpAddress(){
        let address = JSON.parse(sessionStorage.getItem('address'));
        if(address!=null){
          this.employee.address = address.address;
          this.employee.lattitude = address.lat;
          this.employee.longitude = address.lng;
        }
    }

  editEmployee(data){
    window.sessionStorage.removeItem('address');
    this.init();
    this.extra.editTrue = true;
    setTimeout(()=>{this.validationForm.floatLabel()},100)
    this.employee = data;
    // console.log(this.employee,data);
    this.nationality=this._empManagementService.checkCountry(this.countryList,data.nationality);
    // console.log(this.nationality);
    this.userDeclearation = this.employee.userDeclearation==null? this.userDeclearation:data.userDeclearation;
    this.employee.dob = this.validationForm.convertToCustomDate(data.dob);
  }

  updateEmployee(f){
    this.getEmpAddress();
    this.employee.userDeclearation = this.userDeclearation;
    // console.log(this.employee);
    this.extra.loader = true;
    this._empManagementService.updateDataWithAvatar(this.employee,this.avatar).subscribe(
        response => {
          this.extra.code = response.code;
          // console.log(response);
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
            this.extra.editTrue = false;
          }else {
            window.sessionStorage.removeItem('address');
            this.validationForm.getResponce(response,this.extra);
            this.extra.modalEl.modal('hide');
          }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        }
    );
  }

  clearData(){
    this.init();
    this.nationality = [];
    this.extra.editTrue = false;
    window.sessionStorage.removeItem('address');
  }

  onSubmit(f) {
    this.getEmpAddress();
    let userType = new UserType(0, "employee");
    this.employee.user.userType = userType;
    this.extra.loader = true;
        this._empManagementService.addDataWithAvatar(this.employee,this.avatar, this.userDeclearation).subscribe(
            response => {
              this.extra.code = response.code;
              // console.log(response);
              if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
              } else {
                window.sessionStorage.removeItem('address');
                this.validationForm.successRes(response,f,this.extra);
                this.extra.modalEl.modal('hide');
                this.employee = response.Employee;
                var date = this.validationForm.convertToCustomDate(response.Employee.dob);
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

    reset(f){
      f.form.reset(); 
    }

    edit(employee) {
      this.employee = employee;
      if (employee.dob != null && employee.dob.timestamp != null) {
        var date = this.validationForm.convertDate(employee.dob.timestamp);
        this.employee.dob = date;
        // console.log(date);
      }
      this.router.navigate(['/edit-employee']);
    }

   
    confirmation(data){
      this.extra.modalElOpen.modal('show');
      if(data.approved) this.approval ='unapprove';
      else this.approval ='approve'
      this.employeeName = data.user.firstName + ' ' + data.user.lastName;
      this.employee = data;
    }

    changeApproval (){
      this.extra.loader = true;
      this.employee.approved = !this.employee.approved;
      this._empManagementService.approve(this.employee).subscribe(
          response => {
            this.extra.code = response.code;
            if(response.code==200){
              // console.log(response);
              this.validationForm.getResponce(response,this.extra);
              this.extra.modalEl.modal('hide');
            } else this.validationForm.getResponce(response,this.extra);
          },
          error => {
            console.log(<any> error);
            this.validationForm.errorStatus(error,this.extra);
          }
      );
    }

    initDelete(data){
      this.employeeName = data.user.firstName + ' ' + data.user.lastName;
      this.extra.index = this.employeeList.indexOf(data);
      this.employee = data;
      this.employee.archived = true;
    }

    archiveData(){
        this.extra.loader = true;
        // console.log(this.employeeList.length);
        this.employeeList.splice(this.extra.index,1);
        // console.log(this.employeeList.length);

      this._empManagementService.isArchive(this.employee).subscribe(
          response => {
            this.extra.code = response.code;
            if(response.code == 200){
              this.validationForm.getResponce(response,this.extra);
              // console.log(response);
              this.extra.modalEl.modal('hide');
            } else this.validationForm.getResponce(response,this.extra);
          },
          error => {
            console.log(<any> error);
            this.validationForm.errorStatus(error,this.extra);
          }
      );
    }

    /*********** Advance Filter**************/

    toggelIcon(){
      this.extra.pro = !this.extra.pro;
    }

    searchFilterData(){
      if(!(this.mainEmployeeList.length>0)) 
        this.mainEmployeeList = this.employeeList;
      let searchData = this._empManagementService.formateFilterData(this.empFilter);
      // console.log(searchData);
      this.employeeList = this._empManagementService.advanceFilter(this.mainEmployeeList,searchData);
    }

    resetFilter(){
      this.empFilter = new EmpListFilter();
      setTimeout(()=>this.validationForm.floatLabel(),100);
      if(this.mainEmployeeList.length>0) {
        this.employeeList = this.mainEmployeeList;
        this.mainEmployeeList = [];
      }
    }



}
