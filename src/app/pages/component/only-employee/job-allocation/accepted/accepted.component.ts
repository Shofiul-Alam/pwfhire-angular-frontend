import { Component, OnInit, AfterViewInit,ElementRef } from '@angular/core';
import {AllocatedDates} from "./../../../../../models/allocatedDates";
import {AllocationService} from "./../../../../../services/allocations.service";
import {ValidationService} from "./../../../../../services/formValidation.service";
import {Contact} from './../../../../../models/contact';
import {TimeSheet} from './../../../../../models/timeSheet';
import {ExtraData} from './../../../../../models/extraData';
import {UploadService} from "../../../../../services/upload.service";
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ImagePopUpService } from './../../../../../services/imagePopUp.service';
import {Pagination} from "./../../../../../models/pagination";
import {CommonService} from "./../../../../../services/common.service";
import {EmpAllocationFilter} from './../../../../../models/empAllocationFilter';
import {CustomTime} from "./../../../../../models/customTime";
import {EmployeeTimesheetService} from "./../../../../../services/employeeTimesheet.service";



@Component({
  selector: 'accepted-job',
  templateUrl: 'accepted.component.html',
  styleUrls: ['accepted.component.css'],
  providers: [NgbDatepickerConfig]
})
export class AcceptedComponent implements OnInit, AfterViewInit {
  public allocatedDatesList: Array<AllocatedDates> = [];
  public contact:Contact;
  public viewDetails:AllocatedDates;
  public timesheet:TimeSheet;
  public extra:ExtraData;
  meridian:boolean = true; 
  public filesToUpload: Array<File>;
  public uploadFile:any;
  public pagination:Pagination;
  public filterData:EmpAllocationFilter;
  private mainAllocationList:Array<AllocatedDates> = [];
  public timesheetArray:Array<TimeSheet> = [];
  public totaltime:CustomTime;

  constructor(
      private _allocationServices: AllocationService,
      public validationForm: ValidationService,
      private _uploadService: UploadService,
      public imagePopUp: ImagePopUpService,
      private _timesheetService:EmployeeTimesheetService,
      public comService:CommonService,
      private _rootNode: ElementRef,
      config: NgbDatepickerConfig

  ){  
      config.outsideDays = 'hidden';
      this.contact = new Contact();
      this.viewDetails = new AllocatedDates();
      this.timesheet = new TimeSheet();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.filterData = new EmpAllocationFilter();
      this.totaltime = new CustomTime();
  }


  ngOnInit() {
    this.getAcceptedEmployeeAllocations();
    this._uploadService.avatarUpload();
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('.finish div.ngb-tp button');
    this.removeFile();
  }

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.uploadFile = null;
    });
  }


  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page);
    this.getAcceptedEmployeeAllocations();
  }

  getAcceptedEmployeeAllocations() {
    this._allocationServices.getAcceptedEmployeeAllocations().subscribe(
        response => {
          console.log(response);
          this.allocatedDatesList = response.data;
          this.mainAllocationList = JSON.parse(JSON.stringify(this.allocatedDatesList));
          // console.log(JSON.stringify(response.data[2]));
        },
        error => {
          console.log(<any> error);
        });
  }

  getTimesheet(){
    this._timesheetService.getTimesheet(this.pagination.page).subscribe(
      response => {
        console.log(response);
        this.timesheetArray = response.data;
      },
      error => {
        console.log(<any> error);
    });
  }

  checkTimesheet(allocation){
    // for()
  }

  checkData(data){
    if(data!=null&&data.length>0) {
      return true;}
    return false;
  }

  colorContact(i){
    return this.validationForm.colorContact(i);
  }

  initTeamMember(f){
    console.log(f);
  }

  initDetails(data){ 
    if(!data.timesheet){
      this.imagePopUp.imagePreview('./assets/images/big/img3.jpg');
    }
  }

  /***************Upload Timesheet*****************/

  checkOverTime(){
    this.extra.modalElOpen.click(()=>{
      this.timesheet.overtime = this.validationForm.checkOverTime(this.timesheet.finishTime);
      console.log(this.timesheet.overtime);
      setTimeout(()=>this.validationForm.floatLabel());
    });
      
  }

  initUploadTimesheet(data:AllocatedDates){
    this.totaltime = new CustomTime();
    this.clearUpload();
    this.timesheet = new TimeSheet();
    this.timesheet.allocatedDates = data;
    this.timesheet.weekDay = this.validationForm.checkWeekday(data.day);
    this.timesheet.weekend = this.validationForm.checkWeekend(data.day);
    this.timesheet.date = this.validationForm.convertToCustomDate(data.date);
    this.totaltime = this.validationForm.getTimeDifferenc(data.employeeAllocation.task.startTime,data.employeeAllocation.task.endTime);
    this.timesheet.employee = data.employeeAllocation.employee;
    console.log(this.timesheet);
    setTimeout(()=>{
      this.validationForm.floatLabel();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100);
    this.checkOverTime();
  }
  
  uploadTimesheet(f){
    this.timesheet.hoursWorked = this.validationForm.convertToHour(this.totaltime);
    this.extra.loader = true;
    console.log(this.timesheet, this.uploadFile);
    this._timesheetService.addTimesheet(this.timesheet,this.uploadFile).subscribe(
      response => {
        console.log(response);
        this.extra.code = response.code;
        if(response.code==200){
          this.validationForm.successRes(response,f,this.extra);
          this.extra.modalEl.modal('hide');
        } else this.validationForm.getResponce(response,this.extra);
      },
      error => {
        console.log(<any> error);
        this.extra.loader =false;
    });
  }

  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let token;
    let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
    this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
      (result) => {
        // console.log(result['upload']);
        this.uploadFile = result['upload'];
      },
      (error) => {
        console.log(error);
      });
  }

  /***************Filter part***********/

  toggelIcon(){
    this.extra.pro = !this.extra.pro;
  }

  searchData(){ 
    let searchData = this._allocationServices.formateFilterData(this.filterData);
    // console.log(searchData);
    this.allocatedDatesList = this._allocationServices.advanceFilter(this.mainAllocationList,searchData);
  }

  resetFilter(){
    this.filterData = new EmpAllocationFilter();
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainAllocationList.length>0) 
      this.allocatedDatesList = this.mainAllocationList;
  }

  /*************Print Timesheet**************/

  printTimesheet(){
    this.timesheet.hoursWorked = this.validationForm.convertToHour(this.totaltime);
    let data = this._timesheetService.convertTimesheetData(this.timesheet);
    this._timesheetService.printTimesheet(data);   
  }

  clearUpload(){
    $(".dropify-clear").trigger("click");
    this.uploadFile = null;
  }
  

}
