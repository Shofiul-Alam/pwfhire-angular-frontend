import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import {AllocatedDates} from "./../../../../models/allocatedDates";
import {AllocationService} from "./../../../../services/allocations.service";
import {ValidationService} from "./../../../../services/formValidation.service";
import {Contact} from './../../../../models/contact';
import {TimeSheet} from './../../../../models/timeSheet';
import {ExtraData} from './../../../../models/extraData';
import {UploadService} from "../../../../services/upload.service";
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ImagePopUpService } from './../../../../services/imagePopUp.service';
import {Pagination} from "./../../../../models/pagination";
import {GLOBAL} from "./../../../../models/global";
import {TimesheetFilter} from "./../../../../models/timsheetFilter";
import {CustomTime} from "./../../../../models/customTime";
import {CommonService} from "./../../../../services/common.service";
import {EmployeeTimesheetService} from "./../../../../services/employeeTimesheet.service";


@Component({
  selector: 'time-sheet-list',
  templateUrl: 'timeSheetList.component.html',
  styleUrls: ['timeSheetList.component.css']
})
export class EmpTimeSheetListComponent implements OnInit, AfterViewInit{
  public singleOption:Select2Options;
  public timesheetValue:string[] = [];
  public url = GLOBAL.url;
  public allocatedDatesList: Array<AllocatedDates> = [];
  public allocatedDatesArray: Array<AllocatedDates> = [];
  public contact:Contact;
  public viewDetails:AllocatedDates;
  public timesheet:TimeSheet;
  public extra:ExtraData;
  meridian:boolean = true; 
  public filesToUpload: Array<File>;
  public uploadFile:any;
  public pagination:Pagination;
  public timesheetArray:Array<TimeSheet> = [];
  private mainTimesheetArray:Array<TimeSheet> = [];
  public timeFilter:TimesheetFilter;
  public totaltime:CustomTime;
  public allocatedIds:string[]=[];

  constructor(
      private _allocationServices: AllocationService,
      public validationForm: ValidationService,
      private _uploadService: UploadService,
      public imagePopUp: ImagePopUpService,
      private _rootNode: ElementRef,
      public comService:CommonService,
      private _timesheetService:EmployeeTimesheetService,
      config: NgbDatepickerConfig

  ){  
      config.outsideDays = 'hidden';
      this.contact = new Contact();
      this.viewDetails = new AllocatedDates();
      this.timesheet = new TimeSheet();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.timeFilter = new TimesheetFilter();
      this.totaltime = new CustomTime();
  }


  ngOnInit() {
    this.getEmployeeTimesheets(true);
    this._uploadService.avatarUpload();
    this.validationForm.floatLabel();
    this.singleOption = {
      multiple: false
    };
    this.getAcceptedEmployeeAllocations();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('.finish div.ngb-tp button');
    setTimeout(()=>this.removeFile(),1000);
  }

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.uploadFile = null;
    });
  }

    /************get Timsheet**************/

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page);
    this.getEmployeeTimesheets();
  }

  getEmployeeTimesheets(all?:boolean) {
    this._timesheetService.getTimesheet(this.pagination.page).subscribe(
      response => {
        console.log(response);
        this.timesheetArray = response.data;
        this.pagination.itemsPerPage = response.items_per_page;
        this.pagination.total_items_count = response.total_items_count;
        this.mainTimesheetArray = JSON.parse(JSON.stringify(this.timesheetArray));
        this.collectIds(this.timesheetArray);
        if(all) this.getAllTimesheetAllocatedDates(this.pagination.total_items_count,this.pagination.itemsPerPage);
        // console.log(JSON.stringify(response.data[2]));
      },
      error => {
        console.log(<any> error);
    });
  }

  /**********Get accepted allocation****************/

  getAcceptedEmployeeAllocations() {
    this._allocationServices.getAcceptedEmployeeAllocations().subscribe(
      response => {
          // console.log(response);
        this.allocatedDatesList = response.data
        for(let allo of this.allocatedDatesList){
          allo['text'] = this.validationForm.dateShow(allo.date)+'('+
                         allo.employeeAllocation.task.taskName+')';
        }
          // console.log(this.allocatedDatesList);
      },
      error => console.log(<any> error)
    );
  }

  alloDateChanged(data){
    let x = this._timesheetService.findAllocatedDate(this.allocatedDatesList,data.value);
    if(x){
      this.timesheet.allocatedDates = x
      this.timesheet.weekDay = this.validationForm.checkWeekday(x.day)
      this.timesheet.weekend = this.validationForm.checkWeekend(x.day);
      this.timesheet.date = this.validationForm.convertToCustomDate(x.date);
      this.totaltime = this.validationForm.getTimeDifferenc(x.employeeAllocation.task.startTime,x.employeeAllocation.task.endTime);
      this.timesheet.hoursWorked = this.validationForm.convertToHour(this.totaltime);
    }
    if(this.allocatedDatesList.length>0)
      setTimeout(()=>this.timesheet.employee = this.allocatedDatesList[0].employeeAllocation.employee,100);
    
  }

  /************For check Alloctaion Dates****************/

  collectIds(data){
    for(let d of data){
      if(!this.allocatedIds.includes(d.allocatedDates.id))
        this.allocatedIds.push(d.allocatedDates.id);
    }
  }

  checkSelectedDates(data){
    let arr = [];
    for(let d of data){
      if(!this.allocatedIds.includes(d.id)) arr.push(d);
    }   
    return arr;    
  }

  getAllTimesheetAllocatedDates(totalItem,perPage){
    let i=2, total = Math.ceil(totalItem/perPage);
    console.log(total);
    for(i;i<=total;i++){
      this._timesheetService.getTimesheet(i).subscribe(
        response => {
          this.collectIds(response.data);
        },
        error => {
          console.log(<any> error);
      });
    }  
  }

 
  
  /***********image preview**************/

  checkPdf(a){
    return this.validationForm.checkPdf(a);
  }

  changeDoc(){
    this.extra.pro= true;
    setTimeout(()=>{this._uploadService.avatarUpload();
      this.removeFile();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100)
  }
    cancleChange(){
      this.extra.pro= false;
      $(".dropify-clear").trigger("click");
      this.uploadFile = null;
    }

  /*********Add time sheet***************/

  checkOverTime(){
    this.extra.modalElOpen.click(()=>{
      this.timesheet.overtime = this.validationForm.checkOverTime(this.timesheet.finishTime);
      console.log(this.timesheet.overtime);
      setTimeout(()=>this.validationForm.floatLabel());
    });
      
  }

  initUploadTimesheet(){
    this.totaltime = new CustomTime();
    this.extra.con = false;
    this.extra.pro = true;
    this.timesheet = new TimeSheet();
    this.timesheetValue =[];
    this.allocatedDatesArray = this.checkSelectedDates(this.allocatedDatesList);
    console.log(this.timesheet);
    setTimeout(()=>{
      this.validationForm.floatLabel();
      this._uploadService.avatarUpload();
      this.removeFile();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100);
    this.checkOverTime();
  }
  
  uploadTimesheet(){
    this.extra.loader = true;
    console.log(this.timesheet, this.uploadFile);
    this._timesheetService.addTimesheet(this.timesheet,this.uploadFile).subscribe(
      response => {
        console.log(response);
        this.extra.code = response.code;
        if(response.code==200){
          this.getEmployeeTimesheets();
          this.validationForm.getResponce(response,this.extra);
          this.extra.modalEl.modal('hide');
        } else this.validationForm.getResponce(response,this.extra);
      },
      error => {
        console.log(<any> error);
        this.extra.loader =false;
    });
  }

  /*************edit****************/

  initEditTimesheet(data){
    this.timesheet = new TimeSheet();
    this.totaltime = new CustomTime();
    console.log(data);
    this.extra.con = true;
    this.extra.pro = false;
    this.timesheet = data;
    this.timesheet.breakTime = data.break;
    this.timesheet.date = this.validationForm.convertToCustomDate(data.date);
    this.timesheet.startTime = this.validationForm.convertToCustomTime(data.startTime);
    this.timesheet.finishTime = this.validationForm.convertToCustomTime(data.finishTime);
    this.timesheetValue =[data.allocatedDates.id];
    this.allocatedDatesArray = this.allocatedDatesList;
    this.totaltime = this.validationForm.convertHourMin(data.hoursWorked);
    setTimeout(()=>{
      this.validationForm.floatLabel();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100);
  }

  updateTimesheet(){
    this.extra.loader = true;
    console.log(this.timesheet, this.uploadFile);
    this._timesheetService.updateTimesheet(this.timesheet,this.uploadFile).subscribe(
      response => {
        console.log(response);
        this.extra.code = response.code;
        if(response.code==200){
          this.getEmployeeTimesheets();
          this.validationForm.getResponce(response,this.extra);
          this.extra.modalEl.modal('hide');
        } else this.validationForm.getResponce(response,this.extra);
      },
      error => {
        console.log(<any> error);
        this.extra.loader =false;
    });
  }

  /**************Archive*******************/

  initArchiveTimesheet(data,index){
    this.timesheet = new TimeSheet();
    console.log(data,index);
    this.timesheet = data;
    this.extra.index = index;
  }

  archiveTimesheet(){
    this.extra.loader = true;
      this._timesheetService.archiveTimesheet(this.timesheet).subscribe(
        response => {
          this.extra.code = response.code;
          if(response.code == 200){
            this.timesheetArray.splice(this.extra.index,1);
            this.validationForm.getResponce(response,this.extra);
            console.log(response);
            this.extra.modalEl.modal('hide');
          } else this.validationForm.getResponce(response,this.extra);
        },
        error => {
          console.log(<any> error);
          this.extra.loader = false;
        }
    );
  }

  /***********upload function***************/

  fileChangeEvent(fileInput:any){
    this.extra.tsk = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let token;
    let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
    this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
      (result) => {
        // console.log(result['upload']);
        this.extra.tsk = false;
        this.uploadFile = result['upload'];
      },
      (error) => {
        console.log(error);
      });
  }

  toggelIcon(){
    this.extra.loaderadd = !this.extra.loaderadd;
  }

  trackTimesheet(index,sheet){
    return sheet? sheet.id:undefined;
  }

  /*************Print Timesheet**************/

  printTimesheet(timesheet?:TimeSheet){
    let obj = timesheet? timesheet: this.timesheet;
    let data = this._timesheetService.convertTimesheetData(obj);
    this._timesheetService.printTimesheet(data);   
  }

  /***********Advance search*****************/

  searchAdvanceFilter(){
    if(!(this.mainTimesheetArray.length>0))
      this.mainTimesheetArray = this.timesheetArray;
    let searchData = this._timesheetService.formateFilterData(this.timeFilter);
    console.log(searchData);
      this.timesheetArray = this._timesheetService.advanceFilter(this.mainTimesheetArray,searchData);
  }

  resetAdvanceFilter(){
    this.timeFilter = new TimesheetFilter();
      setTimeout(()=>this.validationForm.floatLabel(),100);
      if(this.mainTimesheetArray.length>0) {
        this.timesheetArray = this.mainTimesheetArray;
        this.mainTimesheetArray = [];
      }
  }
  


}
