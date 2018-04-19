import { Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Task } from './../../../../models/task';
import { AdminTaskService } from './../../../../services/admin/adminTask.service';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { ProjectManagement } from './../../../../services/admin/projectManagement.service';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ExtraData} from './../../../../models/extraData';
import { AdminOrderService } from './../../../../services/admin/adminOrder.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { TimeSheet } from './../../../../models/timeSheet';
import { Employee } from './../../../../models/employee';
import { Client } from './../../../../models/client';
import { Project } from './../../../../models/project';
import { Order } from './../../../../models/order';
import { EmployeeManagementService } from './../../../../services/admin/employeeManagement.service';
import {UploadService} from "../../../../services/upload.service";
import {CommonService} from "../../../../services/common.service";
import { ImagePopUpService } from './../../../../services/imagePopUp.service';
import { AdminTimesheetService } from './../../../../services/admin/adminTimesheet.service';
import {AdminTimesheetFilter} from "./../../../../models/timesheetManagementFilter";
import { ExportCSV } from './../../../../services/exportCSV.service';
import {CustomTime} from "./../../../../models/customTime";
import {Pagination} from "./../../../../models/pagination";
import {AdminGLOBAL} from "./../../../../services/admin/adminGlobal";



@Component({
  selector: 'time-sheet-list',
  templateUrl: 'timeSheetList.component.html',
  styleUrls: ['timeSheetList.component.css']
})
export class TimeSheetListComponent implements OnInit {
  public timesheet:TimeSheet;
  public extra:ExtraData;
  public url = AdminGLOBAL.url;
  meridian:boolean = true;  csvExport=null;
  public employeeArray:Array<Employee> = [];
  public projectArray:Array<Project>= [];
  public clientArray: Array<Client>= [];
  public orderArray:Array<Order> = [];
  public taskArray: Array<Task> = [];
  public filesToUpload: Array<File>;
  public timesheetArray:Array<TimeSheet> = [];
  public mainTimesheetArray:Array<TimeSheet> = [];
  public uploadFile:any;
  public timeFilter:AdminTimesheetFilter;
  public approvedArray: string[]=[];
  public totaltime:CustomTime;
  public alloctedDatesList =[];
  public alloctedDatesArray =[];
  public clientvalue:string = '';
  public pagination:Pagination;

  constructor(
    public validationForm: ValidationService,
    private _empService:EmployeeManagementService,
    private _orderService: AdminOrderService,
    private _projectService: ProjectManagement,
    private _clientService: ClientManagment,
    private _rootNode: ElementRef,
    private _taskService: AdminTaskService,
    public imagePopUp: ImagePopUpService,
    private _realTaskService: AdminTaskService,
    private router: Router,
    private _export: ExportCSV,
    private _timesheetService: AdminTimesheetService,
    private _uploadService: UploadService,
    public commonService:CommonService
    ){
      this.init();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.timeFilter = new AdminTimesheetFilter();
  }

  init(){
    this.timesheet = new TimeSheet();
    this.totaltime = new CustomTime();
  }

  ngOnInit() {
    this.employeeList();
    this.clientList();
    this._uploadService.avatarUpload();
    this.validationForm.floatLabel();
    this.getTimesheets();
    this.getAllocatedDates();
    this.approvedArray = ['YES','NO'];
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('.finish div.ngb-tp button');
    this.csvExport = $(this._rootNode.nativeElement).find('div#csvExport.modal');
    this.removeFile();
    this.checkOverTime();
  }

  loadPage(page){
    this.pagination.page = page;
    this.getTimesheets();
  }

  getTimesheets(){
    this._timesheetService.getTimesheet(this.pagination.page).subscribe(
      res=> {
          this.timesheetArray = res.data;
          this.mainTimesheetArray = this.timesheetArray;
          console.log(res);
          this.pagination.total_items_count = res.total_items_count;
          this.pagination.itemsPerPage = res.items_per_page;
      },
      err=> console.log(err)
    );
  }

  getAllocatedDates(){
    this._timesheetService.getEmployeeAllocations().subscribe(
      response => {
          this.alloctedDatesList = response;
          for(let allo of this.alloctedDatesList){
          allo['text'] = this.validationForm.dateShow(allo.date)+'('+
                         allo.employeeAllocation.task.taskName+')';
         }
      },
      error => console.log(<any> error)
    );
  }

  clientList() {
    this.extra.con = false;
    this._clientService.allClientList().subscribe(
      response => {
        if(response.code == 200) {
          this.clientArray = response.data;
        }
      },
      error => console.log(<any> error)
    );
  }

  clientChanged(data){
    this.alloctedDatesArray = this.alloctedDatesList.filter((a)=>{
      return a.employeeAllocation.task.order.project.client.encryptedId == data;
    });
    this.extra.con = true;
    if(!data) this.extra.con = false;
    console.log(this.alloctedDatesArray);
  }

  alloDateChanged(data){
      let allo = this._timesheetService.findbyId(this.alloctedDatesList,data.value);
      setTimeout(()=>{
        this.timesheet.allocatedDates = allo;
        console.log(allo);
        if(allo){ 
          this.timesheet.employee = allo.employeeAllocation.employee;
          this.timesheet.weekDay = this.validationForm.checkWeekday(allo.day)
          this.timesheet.weekend = this.validationForm.checkWeekend(allo.day);
          this.timesheet.date = this.validationForm.convertToCustomDate(allo.date);
          this.totaltime = this.validationForm.getTimeDifferenc(allo.employeeAllocation.task.startTime,allo.employeeAllocation.task.endTime);
          this.timesheet.hoursWorked = this.validationForm.convertToHour(this.totaltime);
          setTimeout(()=>this.validationForm.floatLabel());
        } else {
          let time = new TimeSheet();
          this.timesheet.employee = time.employee;
          this.timesheet.weekDay = time.weekDay
          this.timesheet.weekend = time.weekend
          this.timesheet.date = time.date;
          this.totaltime = new CustomTime();
          this.timesheet.hoursWorked = time.hoursWorked;
          setTimeout(()=>this.validationForm.floatLabel());
        }
      });  
  }

  checkOverTime(){
    this.extra.modalElOpen.click(()=>{
      this.timesheet.overtime = this.validationForm.checkOverTime(this.timesheet.finishTime);
      setTimeout(()=>this.validationForm.floatLabel());
    });
      
  }
  /*******************Add*************/
  initAdd(f){
    this.init();
    this.extra.editTrue = false;
    this.extra.con = false;
    this.clientvalue= '';
    setTimeout(()=>{
      this._uploadService.avatarUpload();
      this.validationForm.floatLabel();
      this.removeFile();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100);
  }

  addTimesheet(f){
    this.extra.loader = true;
    let json = {"timesheet": this.timesheet,"employee":{"id":this.timesheet.employee.id}};
    console.log(json, this.uploadFile);
    this._timesheetService.addTimesheet(json,this.uploadFile).subscribe(
        res=>{
            console.log(res);
            this.extra.code = res.code;
            if(res.code==200){
              this.getTimesheets();
              this.validationForm.getResponce(res,this.extra);
            } else this.validationForm.getResponce(res,this.extra);
        }, err => {
          console.log(err);
          this.extra.loader = false;
        }
      );
  }
  /*************Edir***************/
  initEdit(data){
    this.init();
    this.extra.editTrue = true;
    this.extra.editAvatar= false;
    this.extra.con = true;
    this.timesheet = data;
    this.timesheet.weekDay = this.validationForm.checkday(data.date,true);
    this.timesheet.weekend = this.validationForm.checkday(data.date,false);
    this.timesheet.allocatedDates = data.allocatedDates;
    this.timesheet.startTime = this.validationForm.convertToCustomTime(data.startTime);
    this.timesheet.finishTime = this.validationForm.convertToCustomTime(data.finishTime);
    this.timesheet.date = this.validationForm.convertToCustomDate(data.date);
    this.totaltime = this.validationForm.getTimeDifferenc(data.allocatedDates.employeeAllocation.task.startTime,data.allocatedDates.employeeAllocation.task.endTime);
    setTimeout(()=>this.validationForm.floatLabel(),100);
  }

  updateTimesheet(){
    this.extra.loader = true;
    let json = {"timesheet": this.timesheet,"employee":{"id":this.timesheet.employee.id}};
    console.log(json, this.uploadFile);
    this._timesheetService.updateTimesheet(json,this.uploadFile).subscribe(
        res=>{
            console.log(res);
            this.extra.code = res.code;
            if(res.code==200){
              this.getTimesheets();
              this.validationForm.getResponce(res,this.extra);
            } else this.validationForm.getResponce(res,this.extra);
        }, err => {
          console.log(err);
          this.extra.loader = false;
        }
      );
  }
  /**********Archive******************/
  initArchive(data,i){
    this.extra.index = i;
    this.timesheet = data;
  }

  archiveData(){
    this.extra.loader = true;
    console.log(this.timesheet);
    this._timesheetService.archiveTimesheet(this.timesheet).subscribe(
        res=>{
            console.log(res);
            this.extra.code = res.code;
            if(res.code==200){
              this.timesheetArray.splice(this.extra.index,1);
              this.validationForm.getResponce(res,this.extra);
            } else this.validationForm.getResponce(res,this.extra);
        }, err => {
          console.log(err);
          this.extra.loader = false;
        }
      );
  }

  toggelIcon(){
    this.extra.loaderadd = !this.extra.loaderadd;
  }

  /***********image preview**************/

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.uploadFile = null;
    });
  }

  fileChangeEvent(fileInput:any){
    this.extra.tsk = true;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let token;
    let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
    this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
      (result) => {
        console.log(result['upload']);
        this.uploadFile = result['upload'];
        this.extra.tsk = false;
      },
      (error) => {
        console.log(error);
      });
  }

  checkPdf(a){
    return this.validationForm.checkPdf(a);
  }

  changeDoc(){
    this.extra.editAvatar= true;
    setTimeout(()=>{this._uploadService.avatarUpload();
      this.removeFile();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100)
  }
    cancleChange(){
      this.extra.editAvatar= false;
      $(".dropify-clear").trigger("click");
      this.uploadFile = null;
    }

  /************Advance Search***********/

  employeeList(){
    this._empService.getAllEmp().subscribe(
      res=> {
        if(res.code == 200) {
          this.employeeArray = this._empService.addTextEmp(res.data,'firstName', 'lastName');
        }
      },
      err=> console.log(err)
    );
  }

  projectList(id){
    this._projectService.getClientProjects(id).subscribe(
      response=> {
        if(response.code == 200) {
          this.extra.con = true;
          this.projectArray = response.data;
        }
      },
      error => console.log(<any> error)
    );
  }

  orderList(id){
    let arr:any = {};
        arr.id = id;
    this._orderService.getProjectOrders(arr).subscribe(
      res=> {
        if(res.code == 200) {
          this.extra.pro = true;
          this.orderArray = res.data;
        }
      },
      err=> console.log(err)
    );
  }


  taskList(id){
    let filter:any = {};
    filter.orderId = id;
    this._realTaskService.getOrderTask(filter).subscribe(
      res=> {
        if(res.code == 200) {
          this.extra.tsk = true;
          this.taskArray = res.data;
        }
      },
      err=> console.log(err)
    );
  }

  filterClientChange(data){
    this.extra.con = false;
    this.projectList(data);
  }

  filterProjectChange(data){
    this.extra.pro = false;
    this.orderList(data);
  }

  filterOrderChange(data){
    this.extra.tsk = false;
    this.taskList(data);
  }

  searchFilterData(){
    if(!(this.mainTimesheetArray.length>0))
      this.mainTimesheetArray = this.timesheetArray;
    let searchData = this._timesheetService.formateFilterData(this.timeFilter);
    console.log(searchData);
    this.timesheetArray = this._timesheetService.advanceFilter(this.mainTimesheetArray,searchData);
  }

  resetFilterData(){
    this.timeFilter = new AdminTimesheetFilter();
      setTimeout(()=>this.validationForm.floatLabel(),100);
      if(this.mainTimesheetArray.length>0) {
        this.timesheetArray = this.mainTimesheetArray;
        this.mainTimesheetArray = [];
      }
  }

  /*************Print Timesheet**************/

  printTimesheet(timesheet?:TimeSheet){
    let obj = timesheet? timesheet: this.timesheet;
    let data = this._timesheetService.convertTimesheetData(obj);
    this._timesheetService.printTimesheet(data);   
  }

  /***************Export as CSV***************/

  clientWeekCSV(){
     if(this.timeFilter.client&&this.timeFilter.startDate&&this.timeFilter.endDate){
      let client = this._timesheetService.findbyId(this.clientArray,this.timeFilter.client);
      let dates = this.validationForm.getDateRange(this.timeFilter.startDate,this.timeFilter.endDate);
      let formatedData = this._timesheetService.convertJSONtoCSV(this.timesheetArray);
      let makeTotal = this._timesheetService.formatCSVData(formatedData,dates);
      let csvData = this._timesheetService.formatTotal(makeTotal);
      console.log(csvData);
      this._export.downloadCSV({ filename: "Client-Week.csv", 
        title: client.companyName + '\n'+ 'Dates: ' + 
        this.validationForm.dateShow(dates[0])+' to '+this.validationForm.dateShow(dates[dates.length-1]) }, csvData);
     } else {
       this.extra.tsk = false;
       this.csvExport.modal('show');
     }
  }

  

   /********payroll csv**************/

  payRollCSV(){
    if(this.timeFilter.startDate&&this.timeFilter.endDate){
      let dates = this.validationForm.getDateRange(this.timeFilter.startDate,this.timeFilter.endDate);
      let formatedData = this._timesheetService.payRollJSONtoCSV(this.timesheetArray,dates);
      console.log(formatedData);
      let x = this._timesheetService.formatPayRollCSV(formatedData);
      console.log(x);
      this._export.downloadCSV({ filename: "PayRoll.csv", 
        title: x.client}, x.csv);
    } else {
      this.extra.tsk = true;
      this.csvExport.modal('show');
    }
  }

  


  



  


}
