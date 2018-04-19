import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import {Router} from '@angular/router';
import { Select2OptionData } from 'ng2-select2';
import { Employee } from './../../../../models/employee';
import { ValidationService } from './../../../../services/formValidation.service';
import { EmployeeManagementService } from './../../../../services/admin/employeeManagement.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {CustomDate} from "./../../../../models/customDate";
import {AllocationManagement} from "../../../../services/admin/allocationManagement.service";
import { ProjectManagement } from './../../../../services/admin/projectManagement.service';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ExtraData} from './../../../../models/extraData';
import { AdminOrderService } from './../../../../services/admin/adminOrder.service';
import { AdminTaskService } from './../../../../services/admin/adminTask.service';
import { Client } from './../../../../models/client';
import { Project } from './../../../../models/project';
import { Order } from './../../../../models/order';
import { Task } from './../../../../models/task';
import {AllocatedDates} from "./../../../../models/allocatedDates";
import {EmployeeAllocation} from "../../../../models/employeeAllocation";
import {Pagination} from './../../../../models/pagination';
import {EmpAlloFilter} from './../../../../models/empAlloFilter';


interface alloctaion{
  employee: Employee,
  allocationDates: Array<AllocatedDates>
}

@Component({
  selector: 'employee-allocation',
  templateUrl: 'empAllocation.component.html',
  styleUrls: ['empAllocation.component.css']
})
export class EmpAllocationComponent implements OnInit, AfterViewInit {
  public dateArray:Date[];
  public datesToShow:string[];
  public dateRange = {last:new CustomDate(),next: new CustomDate()};
  public allocation:EmployeeAllocation;
  public extra:ExtraData;
  public projectArray:Array<Project>= [];
  public clientArray: Array<Client>= [];
  public orderArray:Array<Order> = [];
  public taskArray: Array<Task> = [];
  public viewBy:string[];
  public sortBy:string[];
  public scale:string[];
  public allocationArray:Array<EmployeeAllocation> = [];
  public filterAllocationArray:Array<EmployeeAllocation> = [];
  public empIds:string[] = [];
  public pagi:Pagination;
  public currYear = '';
  public empAlloFilter:EmpAlloFilter;
  public autoRefresh:boolean = false;

  constructor(
      public validationForm: ValidationService,
      private _allocationServices: AllocationManagement,
      private _orderService: AdminOrderService,
      private _projectService: ProjectManagement,
      private _clientService: ClientManagment,
      private _taskService: AdminTaskService
    ) {
    this.extra = new ExtraData();
    this.pagi = new Pagination();
    this.allocation = new EmployeeAllocation();
    this.empAlloFilter = new EmpAlloFilter();
  }


  ngOnInit() {
    this.getEmployeeAllocations();
    this.initDateRange();
    this.clientList();
    this.validationForm.floatLabel();
    this.viewBy = ['Employee'];
    this.sortBy = ['Ascending','Descending'];
    this.scale = ['day','week','month'];
  }

  loadPage(page){
    this.pagi.page = page;
    this.getEmployeeAllocations();
  }

  getEmployeeAllocations() {
    this._allocationServices.getEmployeeAllocations(this.pagi.page).subscribe(
        response => {
          this.filterAllocationArray = this._allocationServices.makeEmployeeAllocation(response.data);
          this.allocationArray = this._allocationServices.getPresentDateAllocationList(this.dateRange,this.filterAllocationArray);
          this.pagi.itemsPerPage = response.items_per_page;
          this.pagi.total_items_count = response.total_items_count;
          console.log(response,this.allocationArray);
        },
        error => {
          console.log(<any> error);
        });

  }


  ngAfterViewInit() {
  
  }

  initDateRange(){
    this.datesToShow = ['Running week', 'last week', 'last 2 week', 'last 3 week', 'last 4 week'];
    this.initDateArray();
  }

  initDateArray(){
    this.dateRange = this.getCurrentDateRange(13)
    this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
  }


  getLastDateRange(dif:number){
    let nowDate = new Date();
    let day = nowDate.getDay() + 1;
    let last = nowDate.getTime()-(86400000*day);
    let first = last - (86400000*dif);
    let lastDate = new Date(first);
    let nextDate = new Date(last);
    return {last:this.convertDate(lastDate), next:this.convertDate(nextDate)}
  }

  getCurrentDateRange(dif){
    let nowDate = new Date();
    let day = nowDate.getDay(); 
    let first = nowDate.getTime()-(86400000*day); // First day is the day of the month - the day of the week
    let last = first + (86400000*dif);
    let lastDate = new Date(first);
    let nextDate = new Date(last);
    return {last:this.convertDate(lastDate), next:this.convertDate(nextDate)}
  }

  convertDate(date){
    return new CustomDate(date.getFullYear(), date.getMonth()+1, date.getDate());
  }


  getDates( a, b ){
  	let d = [];
    let x = new Date(a.year , (a.month-1) , a.day).getTime();
    let y = new Date(b.year , (b.month-1) , b.day).getTime();
    for (x;x<=y;x+=86400000){
       	let a = new Date(x);
       	d.push({date:a,year:a.getFullYear()});
    }
    return this.meargeDates(d);
  }

  meargeDates(date){
    this.currYear = '';
    let arr = [], year=[];
    for(let a of date){
      arr.push(a.date);
      if(!year.includes(a.year)) {
        this.currYear += this.currYear==''? a.year:('/'+a.year);
        year.push(a.year);
      }
    }
    return arr;
  }

  splitYear(date){
    let index = date.indexOf(',');
    return date.slice(0,index);
  }

  bgColor(a){
    let x = new Date();
    let nowDate = this.convertDate(x);
    let date = this.convertDate(a);
    let day = new Date(a).getDay();
    if(date.year==nowDate.year&&date.month==nowDate.month&&date.day==nowDate.day) return '#d4edda';
    else if((day == 6) || (day == 0)) return '#ffe5e5'; 
    else return 
  }

  toggelIcon(){
    this.extra.editTrue = !this.extra.editTrue;
  }

  checkDates(arr,d){
    let date = this.convertDate(d);
    return arr.find((a)=>{
      let alloDate = this.validationForm.convertToCustomDate(a.date);
      return (alloDate.year==date.year&&alloDate.month==date.month&&alloDate.day==date.day);
    });
  }

  trackByAlloc(index,allo){
    return allo? allo.id:undefined;
  }

  checkColor(arr,d){
    let data = this.checkDates(arr,d);
    if(data.accecptallocation) return 'btn-success';
    if(data.cancelallocation) return 'btn-danger';
    if(!data.accecptallocation && !data.cancelallocation) return 'btn-warning';
  }

  initDetrails(allo,d){
    let date = this.convertDate(d);
    this.allocation = new EmployeeAllocation();
    this.allocation = JSON.parse(JSON.stringify(allo));
    this.allocation.allocatedDates = allo.allocatedDates.filter((a)=>{ 
      let alloDate = this.validationForm.convertToCustomDate(a.date);
      return (alloDate.year==date.year&&alloDate.month==date.month&&alloDate.day==date.day);
    });
    this.allocation.task = this.allocation.allocatedDates[0]['task'];
  }

  formatText(allo,d){
    let data = this.checkDates(allo,d);
    let client = '', task='';
    let c = data.task.order.project.client.companyName.split(' ');
    for(let a of c){
      client +=a[0];
    }
    let t = data.task.taskName.split(' ');
    for(let a of t){
      task +=a[0];
    }
    return (client+task).slice(0,5).trim();
  }



  /**************** Filter*******************/

  autoRefreshChange(){
    this.autoRefresh = !this.autoRefresh;
  }

  datesChange(data){
    this.empAlloFilter.date = data;
    this.autoRefreshOn();
  }

  datesToShowChange(data){
    if(data==this.datesToShow[0]){
      this.dateRange = this.getCurrentDateRange(6);
      this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
    } else if(data==this.datesToShow[1]){
      this.dateRange = this.getLastDateRange(6);
      this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
    } else if(data==this.datesToShow[2]){
      this.dateRange = this.getLastDateRange(13);
      this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
    } else if(data==this.datesToShow[3]){
      this.dateRange = this.getLastDateRange(20);
      this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
    } else if(data==this.datesToShow[4]){
      this.dateRange = this.getLastDateRange(27);
      this.dateArray = this.getDates(this.dateRange.last,this.dateRange.next);
    } else{
      this.initDateArray();
    }

  }

  clientList() {
    this._clientService.allClientList().subscribe(
      response => {
        if(response.code == 200) {
          this.clientArray = this._projectService.addText(response.data,'companyName');
        }
      },
      error => console.log(<any> error)
    );
  }

 
  projectList(id){
    this._projectService.getClientProjects(id).subscribe(
      response=> {
        if(response.code == 200) {
          this.extra.con = true;
          this.projectArray = this._projectService.addText(response.data,'projectName');
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
          this.orderArray = this._projectService.addText(res.data,'orderTitle');
        }
      },
      err=> console.log(err)
    );
  }

  taskList(id){
    let filter:any = {};
    filter.orderId = id;
    this._taskService.getOrderTask(filter).subscribe(
      res=> {
        if(res.code == 200) {
          this.extra.tsk = true;
          this.taskArray = this._projectService.addText(res.data,'taskName');
        }
      },
      err=> console.log(err)
    );
  }

  filterClientChange(data){
    this.extra.con = false;
    this.projectList(data);
    this.empAlloFilter.client = data;
    this.autoRefreshOn();
  }

  filterProjectChange(data){
    this.extra.pro = false;
    this.orderList(data);
    this.empAlloFilter.project = data;
    this.autoRefreshOn();
  }

  filterOrderChange(data){
    this.extra.tsk = false;
    this.taskList(data);
    this.empAlloFilter.order = data;
    this.autoRefreshOn();
  }

  filterTaskChange(){
    this.autoRefreshOn();
  }

  filterSortChange(){
    this.autoRefreshOn();
  }

  loadTimeline(){
    this.datesToShowChange(this.empAlloFilter.date);
    let filterObj = this._allocationServices.formateFilterData(this.empAlloFilter);
    if(!(this.filterAllocationArray.length>0)) this.filterAllocationArray = this.allocationArray;
    this.allocationArray = this._allocationServices.advanceEmpAlloFilter(this.filterAllocationArray,filterObj,this.dateRange,);
  }

  autoRefreshOn(){
    if(this.autoRefresh) {
      this.loadTimeline();
    }
  }
  

  

  

}
