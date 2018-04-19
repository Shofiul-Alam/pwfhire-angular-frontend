import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../../models/order';
import { Project } from './../../../../models/project';
import { CommonService } from './../../../../services/common.service';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import { ContactManagment } from './../../../../services/admin/contactManagement.service';
import {Client} from './../../../../models/client';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import { AdminOrderService } from './../../../../services/admin/adminOrder.service';
import { ProjectManagement } from './../../../../services/admin/projectManagement.service';
import {APIServices} from "../../../../services/apiServices.service";
import { AllocatedContact } from './../../../../models/allocatedContact';
import {ExtraData} from "./../../../../models/extraData";
import {Pagination} from "./../../../../models/pagination";
import {Router} from '@angular/router';
import {OrderFilter} from "./../../../../models/orderFilter";
import { ExportCSV } from './../../../../services/exportCSV.service';




@Component({
  selector: 'allOrder',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.css']
})
export class AllOrderComponent implements OnInit {
  public options: Select2Options;
  public singleOptins:Select2Options;
  public value: string[];
  public orderList:Array<Order> = [];
  public mainOrderList:Array<Order> = [];
  public orderFilter: OrderFilter;
  public project: Project;
  public statusData;
  public valueStatus; 
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public contactList: Array<Contact> = [];
  public allocatedContact: Array<any> = [];
  public client: Client;
  public clientArray: Array<Client>= [];
  public clientValue: string[];
  public projectArray:Array<Project> = [];
  public projectValue: string[];
  public extra:ExtraData;
  public pagination:Pagination;
  
  public get order():Order {
    return this._orderService.order;
  }
  public set order(value: Order) {
    this._orderService.order = value;
  }

  

  @ViewChild('address') public contactAddressElm: ElementRef;


  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _comService:CommonService,
      private _clientService: ClientManagment,
      private _orderService: AdminOrderService,
      private _rootNode: ElementRef,
      private router: Router,
      public commonService: CommonService,
      private apiService: APIServices,
      private _projectService: ProjectManagement,
      private exportCSV:ExportCSV
    )
  {    
      this.client = new Client();
      this.project = new Project();
      this.userType = new UserType(5,'client');
      this.user = new User (0,"","","","","");
      this.contact = new Contact();
      this.contact.user.userType = this.userType;
      this.project = new Project();
      this.order = new Order();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.orderFilter = new OrderFilter();
  }




  ngOnInit() {
    window.scrollTo(0, 0);
    this.getAllOrder();
    this.statusData = ["Pending", "Approved", "Rejected"];
    this.options = {
      multiple: true,
    }
    this.singleOptins = {
          multiple: false
      }
    this.getAddress();
    this.validationForm.floatLabel();
    this.clientList();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#addOrder');
  }

  orderdata(data){
    // console.log(data);
    this.order = data;
    this.router.navigate(['/order-task']);
  }

  loadPage(page: number) {
      this.pagination.page = page;
      this.getAllOrder();
  }

  getAddress(){
    this.apiService.contactAddress(this.contactAddressElm.nativeElement);
  }

  getAllOrder(){
    this._orderService.allOrder(this.pagination.page).subscribe(
      res=> { 
        // console.log(res);
        this.orderList = res.data;
        this.pagination.total_items_count = res.total_items_count;
        this.pagination.pageSize = res.items_per_page;
      },
      // err=> console.log(err)
    );
  }

  projectList(id){
    this._projectService.getClientProjects(id).subscribe(
      response=> {
        if(response.code == 200) {
          this.projectArray = this._projectService.addText(response.data,'projectName');
          this.extra.editTrue = false;
        }
      },
      error => console.log(<any> error)
    );
  }

 
  projectChanged(data){
    let x = this._projectService.findById(this.projectArray, data.value);
    this.order.project = !x? '':x;
  }

  clientList() {
    this.extra.editTrue = true;
    this._clientService.allClientList().subscribe(
      response => {
        if(response.code == 200) {
          this.clientArray = this._projectService.addText(response.data,'companyName');
        }
      },
      error => console.log(<any> error)
    );
  }

    clientChanged(data: {value: string[]}){
      this.extra.editTrue = true;
      this.client = this._projectService.findById(this.clientArray, data.value);
      if(this.client != null) {
          if(!this.extra.pro) this.projectList(this.client.id);
          this.intContactList();
      }
    }


  changed(data: {value: string[]}) {
    this.valueStatus = data.value;
  }

  intContactList() {
    this.contactList = this._contactService.getSelectedCon(this.client.allocatedContact);
  }

  addContactToAllocation(data: {value: string[]}) {
    this.order.allocatedContact = this._projectService.addAllocatedContact(data.value,this.allocatedContact,'contact');
    // console.log(this.order.allocatedContact);
  }

  initAddOrder(){
    this.extra.pro = false;
    this.order = new Order;
    this.projectValue = [];
    this.value = [];
    this.allocatedContact = this.order.allocatedContact;
    this.valueStatus = 'Pending';
    setTimeout(()=>{
      this.validationForm.floatLabel();
    },100);
  }

  addOrder(f){ 
    this.extra.loader = true;
    this.order.orderStatus = this.valueStatus;
    // console.log(this.order);
    this._orderService.add(this.order).subscribe(
      response => {
            this.extra.code = response.code;
            // console.log(response);
            if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
            } else{
                this.orderList.push(response.Order);
                this.validationForm.successRes(response,f,this.extra);
                this.extra.modalEl.modal('hide');
                this.initAddOrder();
            }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        }
    );

  }

  resetContact(f){
    f.form.reset();
    this.validationForm.openModalScroll('#addOrder','#contact');
    this.extra.modalElOpen.modal('show');
  }

  initContact() {
    this.extra.modalEl.modal('hide');
    window.sessionStorage.removeItem('conAddress');
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
    // console.log(this.contact);
    this.validationForm.contactModalScroll('#contact');
  }

 addContact(f){
    this.extra.loaderadd = true;
    // console.log(this.contact);
    this._contactService.add(this.contact, this.client).subscribe(
      response => {
        this.extra.code = response.code;
        // console.log(response);
        if(response.code != 200) {
            this.extra.loaderadd = false;
            this.validationForm.getResponce(response,this.extra);
        } else {
            this.extra.loaderadd = false;
            this.client.allocatedContact.push(this._projectService.addAllocatedContactClient(response.Contact));
            this.intContactList();
            this.order.project.client.allocatedContact = this.client.allocatedContact;
            this.validationForm.successRes(response,f,this.extra);
            this.extra.modalEl.modal('hide');
            this.validationForm.openModalScroll('#addOrder','#contact');
            this.extra.modalElOpen.modal('show');
            window.sessionStorage.removeItem('conAddress');
        }
      },
      error => {
        console.log(<any> error);
        this.extra.loaderadd = false;
        this.validationForm.errorStatus(error,this.extra);
    });
  }


  editOrder(data){
    this.extra.pro = true;
    // console.log(data);
    this.order = new Order();
    this.order = data;
    this.order.project = data.project;
    this.allocatedContact = this.order.allocatedContact;
    this.order.endDate = this.validationForm.convertToCustomDate(data.endDate);
    this.order.startDate = this.validationForm.convertToCustomDate(data.startDate);
    this.valueStatus = data.orderStatus;
    this.clientValue = [(data.project.client.id).toLocaleString()];
    this.order.project['text'] = this.order.project.projectName;
    this.projectArray = [this.order.project];
    this.projectValue = [(data.project.id).toLocaleString()];
    this.value = this._projectService.getIds(data.allocatedContact,'contact');
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }
  onUpdate (){
    this.extra.loader = true;
    this.order.firstTime = null;
    this.order.orderStatus = this.valueStatus;
        // console.log(this.order);
        this._orderService.update(this.order).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else{
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                    this.extra.pro = false;
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
  }
  


  initArchive(data){
      this.order = JSON.parse(JSON.stringify(data));
      // console.log(this.order);
      this.extra.index = this.orderList.indexOf(data);
      this.order.archived = true;
      // console.log(this.extra.index);
    }

    archiveData(){
        this.extra.loader = true;
        this.orderList.splice(this.extra.index,1);
        this._orderService.archiveOrder(this.order).subscribe(
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

  /******Advance Search************/
  trackOrder(index,order){
    return order? order.id : undefined;
  }

  toggelIcon(){
    this.extra.con = !this.extra.con;
  }

  filterClientChange(data){
    this.extra.editTrue = true;
    this.projectList(data);
  }

  searchFilterData(){
    if(!(this.mainOrderList.length>0))
      this.mainOrderList = this.orderList;
    let searchData = this._orderService.formateFilterData(this.orderFilter);
    // console.log(searchData);
      this.orderList = this._orderService.advanceFilter(this.mainOrderList,searchData);
  }

  resetFilterData(){
    this.orderFilter = new OrderFilter();
      setTimeout(()=>this.validationForm.floatLabel(),100);
      if(this.mainOrderList.length>0) {
        this.orderList = this.mainOrderList;
        this.mainOrderList = [];
      }
  }

 clearAll(){
   this.extra.editTrue = false;
 }


 /***********Export CSV****************/

  downLoadCSV(){
    if(this.orderList){
      let formtedData = this._orderService.formatCSVData(this.orderList);
      this.exportCSV.downloadCSV({ filename: "Order-Data-Table.csv", title:'Order List' }, formtedData);
    }
  }


  
}
