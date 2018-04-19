import { Component, OnInit,ViewChild,HostListener,Output,EventEmitter, ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../../../models/order';
import { Task } from './../../../../../models/task';
import { AdminTaskService } from './../../../../../services/admin/adminTask.service';
import { CommonService } from './../../../../../services/common.service';
import { ValidationService } from './../../../../../services/formValidation.service';
import { AgmMap, AgmMarker } from '@agm/core';
import {Router} from '@angular/router';
import {ProjectManagement } from './../../../../../services/admin/projectManagement.service';
import {ClientManagment } from './../../../../../services/admin/clientManagement.service';
import {ExtraData} from './../../../../../models/extraData';
import {Location} from './../../../../../models/location';
import {AdminOrderService } from './../../../../../services/admin/adminOrder.service';
import {Client} from './../../../../../models/client';
import { Project } from './../../../../../models/project';
import {EmployeeManagementService} from './../../../../../services/admin/employeeManagement.service';
import {WorkerSkill} from './../../../../../models/workerSkill';
import {Employee} from './../../../../../models/employee';
import { ImagePopUpService } from './../../../../../services/imagePopUp.service';
import { APIServices } from './../../../../../services/apiServices.service';
import { SkillCompetencyManagement } from './../../../../../services/admin/adminSkillCompetency.service';
import { AllocationManagement } from './../../../../../services/admin/allocationManagement.service';
import {SkillCompetencyList} from './../../../../../models/SkillCompetencyList';
import {AllocationFilter} from './../../../../../models/allocationFilter';
import {EmployeeAllocation} from './../../../../../models/employeeAllocation';
import {AllocatedDates} from './../../../../../models/allocatedDates';
import {CustomDate} from './../../../../../models/customDate';
import {Induction} from "./../../../../../models/Induction";
import {SMS} from "./../../../../../models/sms";



@Component({
  selector: 'allocation',
  templateUrl: 'allocation.component.html',
  styleUrls: ['allocation.component.css']
})
export class AllAllocationComponent implements OnInit,AfterViewInit {
  public options: Select2Options;
  public extra:ExtraData;
  public loc:Location;
  public allocationList:Array<EmployeeAllocation|Employee> = [];
  public employee:Employee;
  public taskDates:Array<CustomDate>= [];
  public skillDoc:WorkerSkill;
  public markers:Array<Location> = [];
  labelOptions; collapsId:string=''; assigned:boolean = false; 
  sendId:string=''; smsForAll:string= '';
  public skillCompetencyArray: Array<SkillCompetencyList>;
  public skillvalue:string[] = [];
  public allocationFilter:AllocationFilter;
  public employeeAllocation:EmployeeAllocation;
  public mainAllocationList:Array<EmployeeAllocation|Employee> = [];
  public allAllocations:Array<EmployeeAllocation>= [];
  public singleEmpAllocation:Array<EmployeeAllocation> = [];
  public induction:Induction;
  public sms:SMS;
  public smsArray:Array<SMS> = [];
  public empBookIds = [];


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

  @ViewChild(AgmMap) private map: any;
  
  constructor(
    public validationForm: ValidationService,
    private _skillcompetencyService: SkillCompetencyManagement,
    public comService:CommonService,
    public imagePopUp: ImagePopUpService,
    private _orderService: AdminOrderService,
    private _projectService: ProjectManagement,
    private _clientService: ClientManagment,
    private _taskService: AdminTaskService,
    private router: Router,
    private _rootNode: ElementRef,
    private apiService: APIServices,
    private _empservice: EmployeeManagementService,
    private _allocations: AllocationManagement
  )
  {
      this.init();
  }

  init(){
    this.loc = new Location();
    this.extra = new ExtraData();
    this.employee = new Employee();
    this.skillDoc = new WorkerSkill();
    this.allocationFilter = new AllocationFilter();
    this.employeeAllocation = new EmployeeAllocation();
    this.induction = new Induction();
    this.sms = new SMS();
  }


  ngOnInit() {
    if(this.task==undefined||this.task.id == 0) { 
        this.router.navigate(['/orders']);
        this.task = new Task();
    } else {
      // console.log(this.task);
      this.getTaskAllocation();
      this.options = {
          multiple: true
      }
      this.taskDates = this.validationForm.getDates( this.task.startDate, this.task.endDate);
      // console.log(this.taskDates);
      this.findProjectLoc();
      this.compentencylist();
      this.validationForm.floatLabel();
      this.initAllocation();
      this.sms.line = `you have a work from "${this.task.order.project.client.companyName}" at "${this.task.order.project.projectAddress}", to perform "${this.task.taskName}", during the following dates`;
    }
  }

  ngAfterViewInit(){
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#workerSkill');
    this.labelOptions = {
      color: '#CC0000',
      fontSize: '14px',
      fontWeight: 'bold',
      text: 'Some Text',
    }
  }

  inductionDetails(f){
    if(f.hasOwnProperty('induction')) this.induction = f.induction;
    else this.induction = f;

  }


  compentencylist (){
    this._skillcompetencyService.getAll().subscribe(
        response => {
          this.skillCompetencyArray = response.data;
          for(var i = 0; i < this.skillCompetencyArray.length; i++ ) {
            this.skillCompetencyArray[i].text = this.skillCompetencyArray[i].name;
          }
        },
        error => {
          console.log(<any> error);
        }
    );
  }

  changeCompentency(data: {value: string[]}) {
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

  submitFilter(){
    if(!(this.mainAllocationList.length>0)) 
      this.mainAllocationList = JSON.parse(JSON.stringify(this.allocationList));
    if(this.allocationFilter.lastName!=null&&this.allocationFilter.lastName=='') 
      this.allocationFilter.lastName=null;
    if(this.allocationFilter.ratting!=null&&this.allocationFilter.ratting=='') 
      this.allocationFilter.ratting=null;
    if(this.allocationFilter.skillCompetencyList!=null&&this.allocationFilter.skillCompetencyList.length==0) 
      this.allocationFilter.skillCompetencyList=null;
    // console.log(this.allocationFilter);
    if(this.allocationFilter.lastName!=null||this.allocationFilter.ratting!=null||this.allocationFilter.skillCompetencyList!=null)
        this.allocationList = this._allocations.advanceFilter(this.mainAllocationList,this.allocationFilter,this.extra.editAvatar);
  }

  resetAdvanceFilter(){
    this.skillvalue = [];
    this.allocationFilter = new AllocationFilter();
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainAllocationList.length>0) 
      this.allocationList = this.mainAllocationList;
  }
  

  checkArray(job){
    if(Array.isArray(job)) return true;
     else return false;
  }

  backToTask(){
    this.order = this.task.order;
  }


   getTaskAllocation(){
    // console.log(this.task.id);
    this._taskService.getTaskAllocation(this.task.id).subscribe(
      res=> { 
        console.log(res);
        if(res.hasOwnProperty('allocations')){
          this.extra.editAvatar = false;
          let responseData = res.allocations
          this.markers =this._taskService.getEmpLocations(responseData,0);
          for(let i=0; i<responseData.length;i++){
            this.initEmpCompentecy(responseData[i],0,i);
          }
        } else {
          let responseData = res.employeeAllocations; 
          this.extra.editAvatar = true;
          this.assigned = true;
          this.markers =this._taskService.getEmpLocations(responseData,'employee');
          for(let i=0; i<responseData.length;i++){
            this.initEmpCompentecy(responseData[i],'employee',i);
          }
        }
        // console.log(this.markers);
        this.apiService.redrawMap(this.map,this.loc.lat,this.loc.lng);
      },
      err=> console.log(err)
    );
  }

  /*new*/
  initEmpCompentecy(data,prop:string|number,index){ 
    let startDate = this.validationForm.convertToCustomDate(this.task.startDate);
    let endDate = this.validationForm.convertToCustomDate(this.task.endDate);
    this._allocations.findEmployeeBookedDatesWithDoc(data[prop].id,startDate,endDate).subscribe(
            response => {
                console.log(response);
                data[prop]['employeeSkillCompentency'] = response.data.docs;
                data[prop]['bookedDates'] = response.data.bookedDates;
                this.extra.editAvatar? this.allocationList[index] = data:this.allocationList[index] = data[prop];
                console.log(this.allocationList);
                setTimeout(()=>this.checkedSelectedDate(this.allocationList[index]),100);
                if(this.extra.editAvatar) this.addAllocationInAllAllocation(data,index);
            }
        );
  }

  checkAllocation(allo,d){
    for(let e of allo.bookedDates){
      let c = this.validationForm.convertToCustomDate(e.date);
      if(c.year==d.year && c.month==d.month && c.day==d.day) {
        if(!this.empBookIds.includes(allo.id)) this.empBookIds.push(allo.id)
        return true;
      }
    }
    return false;
  }

  checkDisable(id){
    if(this.empBookIds.includes(id)) return true;
    return false;
  }

  addAllocationInAllAllocation(data,index){
    let sms:SMS;
    let allo = JSON.parse(JSON.stringify(data));
    let employeeAllocation = new EmployeeAllocation();
    employeeAllocation.employee.id = allo.employee.id;
    employeeAllocation.task.id = allo.task.id;
    employeeAllocation.id = allo.id;
    for(let alloDate of allo.allocatedDates){
      let allocatedDates = new AllocatedDates();
      allocatedDates.id = alloDate.id;
      allocatedDates.employeeAllocation = this._allocations.getEmployeeAllocationId(alloDate.employeeAllocation);
      allocatedDates.date = this.validationForm.convertToCustomDate(alloDate.date);
      allocatedDates.day = alloDate.day;
      employeeAllocation.allocatedDates.push(allocatedDates);
      let pos = this.validationForm.getSMSIndex(this.smsArray,allo.employee.id);
      if(!(pos>-1)) {
        sms = this.validationForm.createSMSObject(allo.employee,allocatedDates,this.sms,this.task);
        this.smsArray.push(sms);
      } else this.smsArray[pos].dates.push(this.validationForm.smsDates(allocatedDates,this.task));  
    }
    employeeAllocation.sms = this.validationForm.makeSMS(sms);
    
    // console.log(employeeAllocation);
    this.allAllocations[index]=employeeAllocation;
    // console.log(this.allAllocations);
  }

  checkedSelectedDate(data){
    let inputId=[];
    if(this.extra.editAvatar){
      if(data.acceptall){
        $("thead tr th." + this.validationForm.removeDot(data.employee.id)).find('input').prop('checked', true);
      } 
      for(let date of data.allocatedDates){
        inputId.push('#'+this.validationForm.removeDot(data.employee.id)+this.validationForm.dateShow(date.date));
      }
      for(let i=0;i<inputId.length;i++){
        $("tbody tr td.check-box " + inputId[i]).prop('checked', true);
        $("tbody tr td.check-box " + inputId[i]).prop("disabled", true);
      }
    }
  }


/*new*/
  initSkillDetails(f){
    this.extra.tsk = true;
    console.log(f);
    this.skillDoc.name = f.skillCompetencyList.name;
    this.skillDoc.description = f.description;
    this.skillDoc.issueDate = this.validationForm.dateShow(f.issueDate);
    this.skillDoc.expiryDate = this.validationForm.dateShow(f.expiryDate);
    this.skillDoc.docPic = f.documents[0].path + '/' + f.documents[0].fileName;  
  }

  colorContact(i){
    return this.validationForm.colorContact(i);
  }


  findProjectLoc(){
    this.loc.lat = this.task.order.project.lattitude;
    this.loc.lng = this.task.order.project.longitude;
    // console.log(this.loc);
  }

  initAllocation(){
    this.allAllocations =[]
  }

  selectEmployeeAllAllocation(emp,check:boolean){
    if(check){
      // console.log(emp);
      $("tbody tr td." + this.validationForm.removeDot(emp.id)).find('input').prop('checked', true);
      for(let date of this.taskDates){
        this.selectSingleAllocation(emp,date,true);
      }
    } else {
      let index = this.getIndex(emp.id);
      let pos = this.validationForm.getSMSIndex(this.smsArray,emp.id);
      $("tbody tr td." + this.validationForm.removeDot(emp.id)).find('input').prop('checked', false);
      if(!this.extra.editAvatar){  
        this.allAllocations.splice(index,1);  
        this.smsArray.splice(pos,1);
      } else {
        let x:any[]= JSON.parse(JSON.stringify(this.allAllocations[index].allocatedDates));
        let a = [];
        for(let i=0; i<x.length;i++){
          if(!(x[i].id==0)) {
            a.push(i);
          }
        }
        this.allAllocations[index].allocatedDates = [];
        this.smsArray[pos].dates = [];
        for(let j of a){
          this.allAllocations[index].allocatedDates.push(x[j]);
          this.SelectCheckAfterCollapsOut(this.allAllocations,index,emp.id); 
          this.smsArray[pos].dates.push(this.validationForm.smsDates(x[j],this.task));
          this.allAllocations[index].sms = this.validationForm.makeSMS(this.smsArray[pos]); 
        } 
        
      }
      // console.log(this.allAllocations);
    }
  }


  selectSingleAllocation(emp,date:CustomDate,check:boolean){
    if(check){
      let index = this.getIndex(emp.id);
      // console.log(emp);
      if(index>-1){
        let x:boolean =this.checkAllocatedDates(index,this.allAllocations,date,check);
        if(x){
          let allocatedDates = this.selectAllocatedDates(date,this.allAllocations[index].id);
          this.allAllocations[index].allocatedDates.push(allocatedDates);
          this.comService.sortingDateOnly(this.allAllocations[index].allocatedDates,'date',true);
          let pos = this.validationForm.getSMSIndex(this.smsArray,emp.id);
          this.smsArray[pos].dates.push(this.validationForm.smsDates(allocatedDates,this.task));
          this.allAllocations[index].sms = this.validationForm.makeSMS(this.smsArray[pos]);
          
          // console.log(this.allAllocations[index].sms);
        }
        console.log(this.allAllocations);
      } else {
        let employeeAllocation = new EmployeeAllocation();
        employeeAllocation.employee.id = emp.id;
        employeeAllocation.task.id = this.task.id;
        let allocatedDates = this.selectAllocatedDates(date,employeeAllocation.id);
        employeeAllocation.allocatedDates.push(allocatedDates);
        // console.log(employeeAllocation);
        let sms = this.validationForm.createSMSObject(emp,allocatedDates,this.sms,this.task);
        this.smsArray.push(sms);
        employeeAllocation.sms = this.validationForm.makeSMS(sms);
        // console.log(sms, employeeAllocation.sms);
        this.allAllocations.push(employeeAllocation);
        // console.log(this.allAllocations);
      }
    } else {
        let index = this.getIndex(emp.id);
        let pos = this.validationForm.getSMSIndex(this.smsArray,emp.id);
        this.checkAllocatedDates(index,this.allAllocations,date,check);
        if(this.allAllocations[index].allocatedDates.length==0) {
          this.allAllocations.splice(index,1); 
          this.smsArray.splice(pos,1); 
        } else this.remobeDateFromSMS(pos,index,emp,date);
        $("thead tr th." + this.validationForm.removeDot(emp.id)).find('input').prop('checked', false);
        // console.log(this.allAllocations);
      }
  }

  remobeDateFromSMS(pos,index,emp,date){
    let x:any[]= this.smsArray[pos].dates;
    let dateString = this.validationForm.dateShow(date);
    for(let i=0; i<x.length;i++){
      let a = this.validationForm.checkSMSDate(x[i]);
      if(a==dateString) x.splice(i,1);
    }
    this.allAllocations[index].sms = this.validationForm.makeSMS(this.smsArray[pos]);
    // console.log(this.allAllocations[index].sms);
  }

  

  selectAllocatedDates(date,id){
    let allocatedDates = new AllocatedDates();
    allocatedDates.date = date;
    allocatedDates.day = this.validationForm.getWeekDay(date);
    if(this.extra.editAvatar) allocatedDates.employeeAllocation = this._allocations.getEmployeeAllocationId(id);
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

  collaps(data,index){
    // console.log(data)
    this.collapsId =this.extra.editAvatar? data.employee.id:data.id;
       setTimeout(()=>{
          // console.log(index);
          if(this.extra.editAvatar) {
            $("tbody tr td.button-dis").find('button').prop("disabled", true);
            this.SelectCheckAfterCollapsOut(this.allAllocations,index,this.collapsId);
          }
          else {
            let newIndex = this.getIndex(this.collapsId);
            if(newIndex>-1){ 
              // console.log(newIndex);
              this.SelectCheckAfterCollapsOut(this.allAllocations,newIndex,this.collapsId);
            } 
          }
      },100);
  }

  SelectCheckAfterCollapsOut(data,index,id){
    let inputId = []; 
    for(let date of data[index].allocatedDates){
      inputId.push(
        {domId:('#'+this.validationForm.removeDot(id)+this.validationForm.dateShow(date.date)),
        id:date.id});
    }
    // console.log(inputId);
    for(let i=0;i<inputId.length;i++){
      $("tbody tr td " + inputId[i].domId).prop('checked', true);
      if(this.extra.editAvatar && inputId[i].id) {
        $("tbody tr td.check-box " + inputId[i].domId).prop("disabled", true);
        $("tbody tr td.button-dis " + inputId[i].domId).prop("disabled", false);
      }
    }
  }

  getIndex(id){
    if(this.allAllocations.length>0){
      for(let i=0; i<this.allAllocations.length;i++){
        if(this.allAllocations[i].employee.id==id) {
          // console.log(i);
          return i;
        }
      }
      return -1;
    } else return -1;
  }

  initAllAllocation(data?){
   this.employeeAllocation = new EmployeeAllocation();
   this.extra.editTrue = true;
   this.extra.tsk = true;
   if(data!=undefined) {
     this.allAllocations = data;
     this.extra.pro =true;
    }
   this.smsForAll = this.validationForm.showSMS(this.task);
   // console.log(this.allAllocations);
  }

  initSingleAllocation(id?,data?){
    this.employeeAllocation = new EmployeeAllocation();
    this.extra.editTrue = false;
    this.extra.tsk = true;
    if(data!==undefined) {
      this.singleEmpAllocation = data;
      this.extra.pro =true;
    }
    else {
      this.extra.pro =false;
      this.singleEmpAllocation = [this.allAllocations[this.getIndex(id)]];
    }
    this.employeeAllocation.sms = this.singleEmpAllocation[0]['sms'];
    // console.log(this.singleEmpAllocation);
  }



  sendAllocationToEmployee(){
    this.extra.loader = true;
    let sendDate:Array<EmployeeAllocation> = [];
    if(!this.extra.editTrue){
      this.singleEmpAllocation[0]['sms'] = this.employeeAllocation.sms;
      sendDate = this.singleEmpAllocation;
      // console.log(sendDate);
    } else{
      for(let all of this.allAllocations){
        all['sms'] += this.employeeAllocation.sms;
      }
      sendDate = this.allAllocations
      // console.log(sendDate);
    } 

      this._allocations.sendAllocations(sendDate, this.task.id).subscribe(
          response=>{
            this.extra.code = response.code;
            if(response.code==200){
              this.smsArray = [];
              this.allAllocations = [];
              this.allocationList = [];
              this.collapsId = '0';
              this.extra.tsk = false;
              this.extra.pro =false;
              this.extra.editAvatar = false;
              this.getTaskAllocation();
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

  // newly added code

  initCancel(data){
    this.employeeAllocation = new EmployeeAllocation();
    this.extra.tsk = true;
    this.employeeAllocation = data;  
    // console.log(this.employeeAllocation); 
  }

  cancelData(){
    this.cancelCheckboxes(this.employeeAllocation); 
    // console.log(this.allAllocations);
    let empAllo = new EmployeeAllocation();
    empAllo.id = this.employeeAllocation.id;
    empAllo.employee.id = this.employeeAllocation.employee.id;
    // console.log(empAllo)
    this.extra.tsk = false;
    this.extra.modalEl.modal('hide');
  }

  cancelCheckboxes(data){
    let empId = data.employee.id;
    let index = this.getIndex(empId);
    for(let d of data.allocatedDates){
      // console.log(d);
      let domId ='#'+this.validationForm.removeDot(empId)+this.validationForm.dateShow(d.date);
      $("tbody tr td " + domId).prop("checked", false);
      $("tbody tr td.check-box " + domId).prop("disabled", false);
      $("tbody tr td.button-dis " + domId).prop("disabled", true);
    } 
    this.allAllocations.splice(index,1);
  }

  status(data,comDate){
    for(let i of data){
      let date = this.validationForm.dateConversion(i.date);
      if((date.month==comDate.month&&date.day==comDate.day) && i.accecptallocation) return 'Approved';
    }
    return 'Pending';
  }

  notify(data,comDate){
    for(let i of data){
      let date = this.validationForm.dateConversion(i.date);
      if((date.year==comDate.year&&date.month==comDate.month&&date.day==comDate.day)) return 'Yes';
    }
    return 'No';
  }

  comment(data,comDate){
    for(let i of data){
      let date = this.validationForm.dateConversion(i.date);
      if((date.year==comDate.year&&date.month==comDate.month&&date.day==comDate.day) && i.respond) return 'i.respond';
    }
    return ''
  }

  cancelSingleAllocation(id,date){
    this.singleEmpAllocation = [this.allAllocations[this.getIndex(id)]];
    let arr = this.singleEmpAllocation[0].allocatedDates;
    for(let i=0; i<arr.length;i++){
      if(date.year==arr[i].date.year&&date.month==arr[i].date.month&&date.day==arr[i].date.day){
        this.extra.index =i
        break
      }
    }
  }

  cancelAlloctaion(){
    this.changesAfterCancel(this.singleEmpAllocation[0]);
    this.extra.modalEl.modal('hide');
    // console.log(this.singleEmpAllocation);
    // console.log(this.allAllocations);
  }

  changesAfterCancel(data){
    let date = data.allocatedDates[this.extra.index].date;
    let empId = data.employee.id;
    let domId ='#'+this.validationForm.removeDot(empId)+this.validationForm.dateShow(date);
    $("tbody tr td " + domId).prop("checked", false);
    $("tbody tr td.check-box " + domId).prop("disabled", false);
    $("tbody tr td.button-dis " + domId).prop("disabled", true);
    data.allocatedDates.splice(this.extra.index,1);
    if(data.allocatedDates.length>0){
      let pos = this.validationForm.getSMSIndex(this.smsArray,data.employee.id);
      this.smsArray[pos].dates = [];
      for(let dates of data.allocatedDates){
        this.smsArray[pos].dates.push(this.validationForm.smsDates(dates,this.task));
        data.sms = this.validationForm.makeSMS(this.smsArray[pos]); 
      } 
    } else {
      let index = this.getIndex(empId);
      this.allAllocations.splice(index,1); 
    }
  }

  
  checkSingleEmployeeSelect(id){
   $("tbody tr td div div button.send-btn").prop("disabled", true);
    if(this.allAllocations.length>0 && this.getIndex(id)>-1) {
      let dom = this.validationForm.removeDot(id)
      $("tbody tr td div div button." + dom).prop("disabled", false);
    }
  }
  









  imagePop(image){
    this.extra.modalElOpen.modal('hide');
    this.validationForm.contactModalScroll('#ImagePop');
    this.imagePopUp.imagePreview(image);
    
  }

  openWorkerSkill(){
    this.validationForm.openModalScroll('#workerSkill','#ImagePop');
    this.extra.modalElOpen.modal('show');
  }

  deleteClass(){
    this.validationForm.contactModalScroll('#workerSkill');
    this.extra.tsk = false;
  }

  offBackDrop(){
    this.extra.tsk = false;
    this.extra.pro =false;
    this.extra.editTrue =false;
    this.employeeAllocation.sms = "";
  }
  

  
}