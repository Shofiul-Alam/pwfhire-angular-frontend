import { Component, OnInit,ViewChild,HostListener,Output,EventEmitter, ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Task } from './../../../../models/task';
import { AdminTaskService } from './../../../../services/admin/adminTask.service';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { ProjectManagement } from './../../../../services/admin/projectManagement.service';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ExtraData} from './../../../../models/extraData';
import { AdminOrderService } from './../../../../services/admin/adminOrder.service';
import { AdminTimesheetService } from './../../../../services/admin/adminTimesheet.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { TimeSheet } from './../../../../models/timeSheet';
import { Employee } from './../../../../models/employee';
import { Client } from './../../../../models/client';
import { Project } from './../../../../models/project';
import { Order } from './../../../../models/order';
import { EmployeeManagementService } from './../../../../services/admin/employeeManagement.service';
import {UploadService} from "../../../../services/upload.service";
import {CustomTime} from "./../../../../models/customTime";

@Component({
  selector: 'app-time-sheet-basic',
  templateUrl: 'timeSheet.component.html',
  styleUrls: ['timeSheet.component.css']
})
export class TimeSheetComponent implements OnInit,AfterViewInit {
  public timesheet:TimeSheet;
  public extra:ExtraData;
  meridian:boolean = true; 
  public employeeArray:Array<Employee> = [];
  public projectArray:Array<Project>= [];
  public clientArray: Array<Client>= [];
  public orderArray:Array<Order> = [];
  public taskArray: Array<Task> = [];
  public filesToUpload: Array<File>;
  public uploadFile:any;
  public totaltime:CustomTime;
  public alloctedDatesList =[];
  public alloctedDatesArray =[];

  constructor(
    public validationForm: ValidationService,
    private _empService:EmployeeManagementService,
    private _orderService: AdminOrderService,
    private _projectService: ProjectManagement,
    private _clientService: ClientManagment,
    private _rootNode: ElementRef,
    private _taskService: AdminTaskService,
     private _timesheetService: AdminTimesheetService,
    private router: Router,
    private _uploadService: UploadService
    ){
      this.init();
  }

  init(){
    this.timesheet = new TimeSheet();
    this.extra = new ExtraData();
    this.totaltime = new CustomTime();
  }

  ngOnInit() {
    this.getAllocatedDates();
    this.clientList();
    this._uploadService.avatarUpload();
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('.finish div.ngb-tp button');
    this.removeFile();
    this.checkOverTime();
  }

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.uploadFile = null;
    });
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
    console.log(data);
    this.alloctedDatesArray = this.alloctedDatesList.filter((a)=>{
      return a.employeeAllocation.task.order.project.client.encryptedId == data;
    });
    this.extra.con = true;
    if(!data) this.extra.con = false;
    console.log(this.alloctedDatesArray);
  }

  alloDateChanged(data){
      let allo = this._timesheetService.findbyId(this.alloctedDatesList,data.value);
      this.timesheet.allocatedDates = allo;
      if(allo){ 
        this.timesheet.employee = allo.employeeAllocation.employee;
        this.timesheet.weekDay = this.validationForm.checkWeekday(allo.day)
        this.timesheet.weekend = this.validationForm.checkWeekend(allo.day);
        this.timesheet.date = this.validationForm.convertToCustomDate(allo.date);
        this.totaltime = this.validationForm.getTimeDifferenc(allo.employeeAllocation.task.startTime,allo.employeeAllocation.task.endTime);
        this.timesheet.hoursWorked = this.validationForm.convertToHour(this.totaltime);
        console.log(data);
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
  }


  

  checkOverTime(){
    this.extra.modalElOpen.click(()=>{
      this.timesheet.overtime = this.validationForm.checkOverTime(this.timesheet.finishTime);
      console.log(this.timesheet.overtime);
      setTimeout(()=>this.validationForm.floatLabel());
    });
      
  }

  addTimesheet(f){
    this.extra.loader = true;
    let json = {"timesheet": this.timesheet,"employee":{id:this.timesheet.employee.id}};
    console.log(json, this.uploadFile);
    this._timesheetService.addTimesheet(json,this.uploadFile).subscribe(
        res=>{
            console.log(res);
            this.extra.code = res.code;
            if(res.code==200){
              this.validationForm.successRes(res,f,this.extra);
              this.router.navigate(['/timeSheets']);
            } else this.validationForm.getResponce(res,this.extra);
        }, err => {
          console.log(err);
          this.extra.loader = false;
        }
      );
    
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

  /*************Print Timesheet**************/

  printTimesheet(){
    let data = this._timesheetService.convertTimesheetData(this.timesheet);
    this._timesheetService.printTimesheet(data);   
  }

  


}
