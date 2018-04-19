import { Component, OnInit, AfterViewInit,ElementRef} from '@angular/core';
import {AllocatedDates} from "./../../../../../models/allocatedDates";
import {AllocationService} from "./../../../../../services/allocations.service";
import {ValidationService} from "./../../../../../services/formValidation.service";
import {Contact} from './../../../../../models/contact';
import {ExtraData} from './../../../../../models/extraData';
import {Pagination} from "./../../../../../models/pagination";
import {EmpAllocationFilter} from './../../../../../models/empAllocationFilter';
import {CommonService} from "./../../../../../services/common.service";



@Component({
  selector: 'new-job',
  templateUrl: 'new.component.html',
  styleUrls: ['new.component.css']
})
export class NewJobComponent implements OnInit,AfterViewInit {

  public allocatedDatesList: Array<AllocatedDates> = [];
  public contact:Contact;
  public alloDates:AllocatedDates;
  public extra:ExtraData;
  public pagination:Pagination;
  public filterData:EmpAllocationFilter;
  private mainAllocationList:Array<AllocatedDates> = [];

  constructor(
      private _allocationServices: AllocationService,
      public validationForm: ValidationService,
      public comService:CommonService,
      private _rootNode: ElementRef

  ){
      this.contact = new Contact();
      this.alloDates = new AllocatedDates();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.filterData = new EmpAllocationFilter();
  }


  ngOnInit() {
    this.getPendingEmployeeAllocations();
    this.validationForm.floatLabel();
  }

  ngAfterViewInit(){
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page);
    this.getPendingEmployeeAllocations();
  }

  getPendingEmployeeAllocations() {
    this._allocationServices.getPendingEmployeeAllocations().subscribe(
        response => {
          console.log(response);
          this.allocatedDatesList = response.data;
          this.mainAllocationList = JSON.parse(JSON.stringify(this.allocatedDatesList));
        },
        error => {
          console.log(<any> error);
        });
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
    this.alloDates = data;
    this.alloDates.date = this.validationForm.convertToCustomDate(data.date);
    // console.log(this.alloDates);
  }

  confirmation(data:AllocatedDates,app:boolean,index:number){
    this.alloDates = data;
    this.extra.editTrue = app;
    this.extra.index = index;
    // console.log(this.alloDates);
  }

  changeApproval (){
    this.extra.loader = true;
    if(this.extra.editTrue){
      this.alloDates.accecptallocation = true;
      let sendData = this._allocationServices.formateSendingData(this.alloDates);
      this._allocationServices.acceptEmployeeAllocations(sendData).subscribe(
        response => {
          this.responsemethod(response);   
        },
        error => {
          console.log(<any> error);
          this.extra.loader = false;
      });
    } else {
      this.alloDates.cancelallocation = true;
      let sendData = this._allocationServices.formateSendingData(this.alloDates);
      this._allocationServices.denyEmployeeAllocations(sendData).subscribe(
        response => {
           this.responsemethod(response);
        },
        error => {
          console.log(<any> error);
          this.extra.loader = false;
      });
    }   
  }

  responsemethod(response){
    // console.log(response);
    this.extra.code = response.code;
    if(response.code==200){
      this.allocatedDatesList.splice(this.extra.index,1);
      this.mainAllocationList = JSON.parse(JSON.stringify(this.allocatedDatesList));
      this.validationForm.getResponce(response,this.extra);
      this.extra.modalEl.modal('hide');
    } else this.validationForm.getResponce(response,this.extra);
      
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

  

 

 

}
