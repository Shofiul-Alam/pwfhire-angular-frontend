import { Component, OnInit,ViewChild,HostListener,Output,EventEmitter, ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../../../models/order';
import { Job } from './../../../../../models/Job';
import { Task } from './../../../../../models/task';
import { AdminTaskService } from './../../../../../services/admin/adminTask.service';
import { CommonService } from './../../../../../services/common.service';
import { ValidationService } from './../../../../../services/formValidation.service';
import { AgmMap, AgmMarker } from '@agm/core';
import {APIServices} from "../../../../../services/apiServices.service";
import {Router} from '@angular/router';
import { ProjectManagement } from './../../../../../services/admin/projectManagement.service';
import { ClientManagment } from './../../../../../services/admin/clientManagement.service';
import { AllocatedContact } from './../../../../../models/allocatedContact';
import {JobService} from "../../../../../services/admin/job.service";
import {ExtraData} from './../../../../../models/extraData';
import {Location} from './../../../../../models/location';
import { AdminOrderService } from './../../../../../services/admin/adminOrder.service';
import {Client} from './../../../../../models/client';
import { Project } from './../../../../../models/project';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Induction} from "./../../../../../models/Induction";
import {TaskFilter} from "./../../../../../models/taskFilter";
import {Pagination} from "./../../../../../models/pagination";
import { ExportCSV } from './../../../../../services/exportCSV.service';



@Component({
  selector: 'task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.css']
})
export class AllTaskComponent implements OnInit, AfterViewInit {
  public job: Job;
  public taskList: Array<Task> = [];
  public mainTaskList: Array<Task> = [];
  public taskFilter:TaskFilter;
  public singleOptins:Select2Options;
  public jobArray: Array<any>= [];
  public jobValue:string[];
  public extra:ExtraData;
  public location:Location;
  meridian:boolean = true;
  public induction:Induction;
  public pagination:Pagination;
  
  @ViewChild(AgmMap) private map: any;
  @ViewChild('address') public contactAddressElm: ElementRef;


  public get order():Order {
    return this._orderService.order;
  }
  public set order(value: Order) {
    this._orderService.order = value;
  }

  public get task():Task {
    return this._taskService.task;
  }
  public set task(value: Task) {
    this._taskService.task = value;
  }
  
  
  
  constructor(
    public validationForm: ValidationService,
    public comService:CommonService,
    private _orderService: AdminOrderService,
    private _projectService: ProjectManagement,
    private _clientService: ClientManagment,
    private _rootNode: ElementRef,
    private _taskService: AdminTaskService,
    private _realTaskService: AdminTaskService,
    private _jobService: JobService,
    private config: NgbDatepickerConfig,
    // private apiService: APIServices,
    private router: Router,
    private exportCSV:ExportCSV
    ){
      this.init();
  }

  init(){
    this.job = new Job();
    this.location = new Location();
    this.extra = new ExtraData();
    this.task.payRate = null;
    this.induction = new Induction();
    this.taskFilter = new TaskFilter();
    this.pagination = new Pagination();
  }

  

  ngOnInit() {
    // console.log(this.order);
    if(this.order==undefined||this.order.id == '0') {
      this.order = new Order();
      this.router.navigate(['/orders']);
    } else {
      // console.log(this.order);
      this.singleOptins = {
        multiple: false
      }
      this.validationForm.floatLabel();
      this.getTaskList();
      this.jobList();
      this.findLocation();
      this.configTaskDate();
    }
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  configTaskDate(){
    this.config.minDate = this.validationForm.convertToCustomDate(this.order.startDate);
    this.config.maxDate = this.validationForm.convertToCustomDate(this.order.endDate);
  }

  taskdata(data){
    // console.log(data);
    this.task = data;
    this.router.navigate(['/order-allocation']);
  }


 findLocation(){      
    // console.log(this.order.project.longitude);
    this.location.lat = this.order.project.lattitude;
    this.location.lng = this.order.project.longitude;
    this.comService.redrawMap(this.map, this.location.lat, this.location.lng);
  }

  loadPage(page: number) {
      this.pagination.page = page;
      this.getTaskList();
  }

  getTaskList(){
     // console.log(this.order);
      let filter:any = {};
      filter.orderId = this.order.id;
    this._realTaskService.getOrderTask(filter).subscribe(
      res=> { 
        // console.log(res);
        this.taskList = res.data;
        this.pagination.total_items_count = res.total_items_count;
        // this.pagination.pageSize = res.items_per_page;
      },
      err=> console.log(err)
    );
  }

  jobList() {
    this._jobService.getJobList().subscribe(
        response => {
          if(response.code == 200) {
            this.jobArray = response.data;
            for(var i = 0; i < this.jobArray.length; i++ ) {
              this.jobArray[i].text = this.jobArray[i].name;
            }
          }
        }
    );
  }

  jobChanged(data: {value: string[]}){
      setTimeout(()=>{
        this.task.job = this._taskService.findById(this.jobArray,data.value);
        if(this.extra.editTrue&&this.jobValue){

        }
      },100);
  }

  inductionDetails(f){
    if(f.hasOwnProperty('induction')) this.induction = f.induction;
    else this.induction = f;

  }

  initAddTask(){
    this.extra.editTrue = false;
    this.task = new Task();
    this.task.order = this.order;
    this.jobValue = [(this.jobArray[0].id).toLocaleString()];
    this.task.job.payscale = this.jobArray[0].payscale;
    this.task.job.chargeRate = this.jobArray[0].chargeRate;
    setTimeout(()=>this.validationForm.floatLabel(),200);
  }

  addTask(f){ 
    this.extra.loader = true;
    this.task.payRate = this.task.job.payscale;
    this.task.chargeRate = this.task.job.chargeRate;
    // console.log(this.task);
    // console.log(this.task);
    this._taskService.add(this.task).subscribe(
      response=>{
        this.extra.code = response.code;
        // console.log(response);
        if(response.code==200){
          this.taskList.push(response.Task);
          this.validationForm.successRes(response,f,this.extra);
          this.extra.modalEl.modal('hide');
          this.initAddTask();
        } else this.validationForm.getResponce(response,this.extra);
      },
      error=>{
        this.validationForm.errorStatus(error,this.extra);
        console.log(<any> error);
      }
    );
  }

  checkArray(job){
    if(Array.isArray(job)) return true;
     else return false;
  }

  editTask(task){
    this.extra.editTrue = true;
    // console.log(task);
    this.task = task;
    this.task.startDate = this.validationForm.convertToCustomDate(task.startDate);
    this.task.endDate = this.validationForm.convertToCustomDate(task.endDate);
    this.task.startTime = this.validationForm.convertToCustomTime(task.startTime);
    this.task.endTime = this.validationForm.convertToCustomTime(task.endTime);
    this.jobValue = [(this.checkArray(task.job)?task.job[0].id:task.job.id).toLocaleString()];
    setTimeout(()=>{
      this.task.job.chargeRate = task.chargeRate;
      this.task.job.payscale = task.payRate;
      this.validationForm.floatLabel();},150);
  }


    updateTask(f){
        this.extra.loader = true;
        this.task.payRate = this.task.job.payscale;
        this.task.chargeRate = this.task.job.chargeRate;
        this.task.job.induction = null;
        this.task.job.splicedTask = null;
        this.task.job.splicedInduction = null;


        // console.log(f);
        this._taskService.update(f).subscribe(
            response=>{
                this.extra.code = response.code;
                // console.log(response);
                if(response.code==200){
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                } else this.validationForm.getResponce(response,this.extra);
            },
            error=>{
                this.validationForm.errorStatus(error,this.extra);
                console.log(<any> error);
            }
        );
    }

  initArchive(data){
      this.task = JSON.parse(JSON.stringify(data));
      this.task.archived = true;
      this.extra.index = this.taskList.indexOf(data);
      // console.log(this.extra.index);
    }


    archiveData(){
        this.extra.loader = true;
        this.taskList.splice(this.extra.index,1);
        this._taskService.archiveTask(this.task).subscribe(
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


  reset(f){
    f.form.reset();
  }

  colorContact(i){
    return this.validationForm.colorContact(i);
  }

  /*********** Advance Search*********/

  tracktask(index,task){
    return task? task.id :undefined;
  }

  toggelIcon(){
    this.extra.con = !this.extra.con;
  }

  searchFilterData(){
    if(!(this.mainTaskList.length>0))
    this.mainTaskList = this.taskList;
    let searchData = this._taskService.formateFilterData(this.taskFilter);
    // console.log(searchData);
    this.taskList = this._taskService.advanceFilter(this.mainTaskList,searchData);
  }

  resetFilterData(){
    this.taskFilter = new TaskFilter();
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainTaskList.length>0) {
      this.taskList = this.mainTaskList;
      this.mainTaskList = [];
    }
  }

  /***********Export CSV****************/

  downLoadCSV(){
    if(this.taskList){
      let formtedData = this._taskService.formatCSVData(this.taskList);
      this.exportCSV.downloadCSV({ filename: "Task-Data-Table.csv", title:'Task List' }, formtedData);
    }
  }

  

}
