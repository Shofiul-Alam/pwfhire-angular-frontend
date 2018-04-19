import { Component,ViewChild,Output,EventEmitter, ElementRef,Input} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../models/order';
import { Task } from './../../../models/task';
import { AdminTaskService } from './../../../services/admin/adminTask.service';
import { CommonService } from './../../../services/common.service';
import { ValidationService } from './../../../services/formValidation.service';
import {ExtraData} from './../../../models/extraData';
import {EmployeeManagementService} from './../../../services/admin/employeeManagement.service';
import {WorkerSkill} from './../../../models/workerSkill';
import {Employee} from './../../../models/employee';
import { SkillCompetencyManagement } from './../../../services/admin/adminSkillCompetency.service';
import {SkillCompetencyList} from './../../../models/SkillCompetencyList';
import {AllocationFilter} from './../../../models/allocationFilter';
import {EmployeeAllocation} from './../../../models/employeeAllocation';
import {AllocatedDates} from './../../../models/allocatedDates';
import {CustomDate} from './../../../models/customDate';
import { AllocationManagement } from './../../../services/admin/allocationManagement.service';
import {SMS} from "./../../../models/sms";




@Component({
  selector: 'allocation-popup',
  templateUrl: 'allocation-popup.component.html',
  styleUrls: ['allocation-popup.component.css']
})
export class AllAllocationPopUpComponent {
  public options: Select2Options;
  public extra:ExtraData;
  public allocations:Array<Employee> = [];
  public employee:Employee;
  public taskDatespop:Array<CustomDate>= [];
  labelOptions; collapsIdPop:string;
  public skillvalue:string[] = [];
  public allocationFilter:AllocationFilter;
  public allAllocationspop:Array<EmployeeAllocation>;
  public smsArrayPop:Array<SMS> = [];
  public mainAllocationListpop:Array<Employee>= [];
  public allocatedEmpIds:string[] = [];
  public loader:boolean = false;
  public emppopBookIds = [];




  @Input('allocatedEmp') public allocatedEmp:Array<EmployeeAllocation>;
  @Input('task') public task:Task;
  @Input('sms') public sms:SMS;
  @Input('skillCompetencies') public skillCompetencyArray:Array<SkillCompetencyList>;
  // @Input('loader') public loader:boolean = false;
  @Output('skillDetails') public skillDetails:EventEmitter<WorkerSkill> = new EventEmitter();
  @Output('cancel') public cancel:EventEmitter<any> = new EventEmitter();
  @Output('sendAll') public sendAll:EventEmitter<Array<EmployeeAllocation>> = new EventEmitter();
  @Output('sendOne') public sendOne:EventEmitter<Array<EmployeeAllocation>> = new EventEmitter();
  
  
  constructor(
    public validationForm: ValidationService,
    private _skillcompetencyService: SkillCompetencyManagement,
    public comService:CommonService,
    private _taskService: AdminTaskService,
    private _rootNode: ElementRef,
    private _empservice: EmployeeManagementService,
    private _allocations: AllocationManagement
  )
  {
      this.init();
  }

  init(){
    this.extra = new ExtraData();
    this.employee = new Employee();
    this.allocationFilter = new AllocationFilter();
  }


  initAllNewAllocation() {
      this.allocations = [];
      this.loader = true;
      this.allocatedEmpIds = this._allocations.makeempIdArray(this.allocatedEmp);
      // console.log(this.allocatedEmpIds,this.task);
      this.extra.modalEl = $(this._rootNode.nativeElement).find('#newAllocation.modal#smsFormnew');
      this.getTaskAllocationForPop();
      this.options = {
          multiple: true
      }
      this.taskDatespop = this.validationForm.getDates( this.task.startDate, this.task.endDate);
      // console.log(this.taskDatespop);
      this.initAllocation();
  }

  toggoleIcon(){
    this.extra.loaderadd = !this.extra.loaderadd;
    setTimeout(()=>this.validationForm.floatLabel(),100); 
  }
  
  changeCompentencyPop(data: {value: string[]}) {
    this.allocationFilter.skillCompetencyList = [];
    for(var i=0; i < data.value.length; i++) {
      let SkillCom = new SkillCompetencyList();
      SkillCom.id = data.value[i];
      SkillCom.name = null;
      SkillCom.job = null
      this.allocationFilter.skillCompetencyList.push(SkillCom);
      // console.log(this.allocationFilter);
    }

  }

  submitFilterPop(){
    if(!(this.mainAllocationListpop.length>0)) 
      this.mainAllocationListpop = JSON.parse(JSON.stringify(this.allocations));
    if(this.allocationFilter.lastName!=null&&this.allocationFilter.lastName=='') 
      this.allocationFilter.lastName=null;
    if(this.allocationFilter.ratting!=null&&this.allocationFilter.ratting=='') 
      this.allocationFilter.ratting=null;
    if(this.allocationFilter.skillCompetencyList!=null&&this.allocationFilter.skillCompetencyList.length==0) 
      this.allocationFilter.skillCompetencyList=null;
    // console.log(this.allocationFilter);
    if(this.allocationFilter.lastName!=null||this.allocationFilter.ratting!=null||this.allocationFilter.skillCompetencyList!=null)
        this.allocations = this._allocations.advanceFilter(this.mainAllocationListpop,this.allocationFilter,false);
  }

  resetAdvanceFilterPop(){
    this.skillvalue = [];
    this.allocationFilter = new AllocationFilter();
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainAllocationListpop.length>0) 
      this.allocations = this.mainAllocationListpop;
  }

  checkArray(job){
    if(Array.isArray(job)) return true;
     else return false;
  }


   getTaskAllocationForPop(){
    // console.log(this.task.id);
    this._taskService.getEmployeesForAllocation(this.task.id).subscribe(
      res=> { 
        console.log(res,this.allocatedEmpIds);
        let responseData = res.allocations.filter((n)=>{
            return  !this.allocatedEmpIds.includes(n[0].id);
        })
        console.log(responseData);
        for(let i=0; i<responseData.length;i++){
          this.initEmpCompentecyForPop(responseData[i],i); 
        }
        this.loader = false;
      },
      err=> console.log(err)
    );
  }

  initEmpCompentecyForPop(emp,index){ 
    let startDate = this.validationForm.convertToCustomDate(this.task.startDate);
    let endDate = this.validationForm.convertToCustomDate(this.task.endDate);
    this._allocations.findEmployeeBookedDatesWithDoc(emp[0].id,startDate,endDate).subscribe(
            response => {
                console.log(response);
                emp[0]['employeeSkillCompentency'] = response.data.docs;
                emp[0]['bookedDates'] = response.data.bookedDates;
                this.allocations[index] = emp[0];

                console.log(this.allocations);
            }
        );
  }

  popcheckAllocation(allo,d){
    for(let e of allo.bookedDates){
      let c = this.validationForm.convertToCustomDate(e.date);
      if(c.year==d.year && c.month==d.month && c.day==d.day) {
        if(!this.emppopBookIds.includes(allo.id)) this.emppopBookIds.push(allo.id)
        return true;
      }
    }
    return false;
  }

  popcheckDisable(id){
    if(this.emppopBookIds.includes(id)) return true;
    return false;
  }

  colorContact(i){
    return this.validationForm.colorContact(i);
  }


  initAllocation(){
    this.allAllocationspop =[]
  }

  PopEmployeeAllAllocation(emp,check:boolean){
    if(check){
      // console.log(emp);
      $("#newAllocation tbody tr td." + this.validationForm.removeDot(emp.id)+'newAllocation').find('input').prop('checked', true);
      for(let date of this.taskDatespop){
        this.PopSingleAllocation(emp,date,true);
      }
    } else {
      $("#newAllocation tbody tr td." + this.validationForm.removeDot(emp.id)+'newAllocation').find('input').prop('checked', false);
      let index = this.getIndexPop(emp.id);
      let pos = this.validationForm.getSMSIndex(this.smsArrayPop,emp.id);
      this.allAllocationspop.splice(index,1);
      this.smsArrayPop.splice(pos,1);
      // console.log(this.allAllocationspop);
    }
  }


  PopSingleAllocation(emp,date:CustomDate,check:boolean){
    if(check){
      let index = this.getIndexPop(emp.id);
      // console.log(emp);
      if(index>-1){
        let x:boolean =this.checkAllocatedDates(index,this.allAllocationspop,date,check);
        if(x){
          let allocatedDates = this.selectAllocatedDatesPop(date);
          this.allAllocationspop[index].allocatedDates.push(allocatedDates);
          // console.log(this.allAllocationspop);
          let pos = this.validationForm.getSMSIndex(this.smsArrayPop,emp.id);
          this.smsArrayPop[pos].dates.push(this.validationForm.smsDates(allocatedDates,this.task));
          this.allAllocationspop[index].sms = this.validationForm.makeSMS(this.smsArrayPop[pos]);
          // console.log(this.allAllocationspop[index].sms);
        }

      } else {
        let employeeAllocation = new EmployeeAllocation();
        employeeAllocation.employee.id = emp.id;
        employeeAllocation.task.id = this.task.id;
        let allocatedDates = this.selectAllocatedDatesPop(date);
        employeeAllocation.allocatedDates.push(allocatedDates);
        // console.log(employeeAllocation);
        let sms = this.validationForm.createSMSObject(emp,allocatedDates,this.sms,this.task);
        this.smsArrayPop.push(sms);
        employeeAllocation.sms = this.validationForm.makeSMS(sms);
        // console.log(sms, employeeAllocation.sms);
        this.allAllocationspop.push(employeeAllocation);
        // console.log(this.allAllocationspop);
      }
    } else {
        let index = this.getIndexPop(emp.id);
        let pos = this.validationForm.getSMSIndex(this.smsArrayPop,emp.id);
        this.checkAllocatedDates(index,this.allAllocationspop,date,check);
        let x= this.allAllocationspop[index].allocatedDates;
        if(x.length==0) {
          this.allAllocationspop.splice(index,1);  
          this.smsArrayPop.splice(pos,1);
        } else this.remobeDateFromSMS(pos,index,emp,date);
        $("#newAllocation thead tr th." + this.validationForm.removeDot(emp.id)+'newAllocation').find('input').prop('checked', false);
        // console.log(this.allAllocationspop);
      }
  }

  remobeDateFromSMS(pos,index,emp,date){
    let x:any[]= this.smsArrayPop[pos].dates;
    let dateString = this.validationForm.dateShow(date);
    for(let i=0; i<x.length;i++){
      let a = this.validationForm.checkSMSDate(x[i]);
      if(a==dateString) x.splice(i,1);
    }
    this.allAllocationspop[index].sms = this.validationForm.makeSMS(this.smsArrayPop[pos]);
    // console.log(this.allAllocationspop[index].sms);
  }

  selectAllocatedDatesPop(date){
    let allocatedDates = new AllocatedDates();
    allocatedDates.date = date;
    allocatedDates.day = this.validationForm.getWeekDay(date);
    return allocatedDates;
  }

  checkAllocatedDates(index,allAllocations,date,unCheck?){
    let x:any[]= allAllocations[index].allocatedDates;
    for(let i=0; i<x.length;i++){
      if(x[i].date.year==date.year&&x[i].date.month==date.month&&x[i].date.day==date.day){
        if(unCheck) return false;
        else {
          x.splice(i,1);
          break;
        }
      }
    }
    return true;
  }

  collapsPop(emp){
    this.collapsIdPop = emp.id;
    setTimeout(()=>{
      let index = this.getIndexPop(emp.id);
      if(index>-1){
        let inputId = [];
        for(let date of this.allAllocationspop[index].allocatedDates){
          inputId.push('#'+this.validationForm.removeDot(emp.id)+this.validationForm.dateShow(date.date)+'newAllocation');
        }
        for(let i=0;i<inputId.length;i++){
            let x = "#newAllocation tbody tr td "+ inputId[i];
            $(x).prop('checked', true);
        }
      }
    },100); 
  }

  
  

  getIndexPop(id){
    if(this.allAllocationspop.length>0){
      for(let i=0; i<this.allAllocationspop.length;i++){
        if(this.allAllocationspop[i].employee.id==id) {
          // console.log(i);
          return i;
        }
      }
      return -1;
    } else return -1;
  }

  initAllAllocationPop(){
    // console.log(this.allAllocationspop);
    this.sendAll.emit(this.allAllocationspop);
  }

  initSingleAllocationPop(id){
    // console.log(this.allAllocationspop);
    let x = [this.allAllocationspop[this.getIndexPop(id)]];
    this.sendOne.emit(x);
  }


  initSkillDetailsPop(f){
     this.skillDetails.emit(f);
  }


  initCancelPop(data,i){
    let obj = {emp:data,index:i};
    this.cancel.emit(obj);
  }

  closeModal(){
    this.extra.modalEl.modal('hide');
    this.extra.con = false;
  }



  
}