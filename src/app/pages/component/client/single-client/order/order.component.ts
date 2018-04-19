import { Component,OnInit,AfterViewInit,ViewChild, ElementRef,NgZone} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../../../models/order';
import { Project } from './../../../../../models/project';
import { CommonService } from './../../../../../services/common.service';
import { User } from './../../../../../models/user';
import { Contact } from './../../../../../models/contact';
import { UserType } from './../../../../../models/UserType';
import { ValidationService } from './../../../../../services/formValidation.service';
import { ContactManagment } from './../../../../../services/admin/contactManagement.service';
import {Client} from './../../../../../models/client';
import { AdminOrderService } from './../../../../../services/admin/adminOrder.service';
import {ExtraData} from './../../../../../models/extraData';
import {Location} from './../../../../../models/location';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {InductionService} from "../../../../../services/admin/adminInduction.service";
import {Induction} from "./../../../../../models/Induction";
import { AgmMap, AgmMarker } from '@agm/core';
import {Router} from '@angular/router';
import { ProjectManagement } from './../../../../../services/admin/projectManagement.service';
import { ClientManagment } from './../../../../../services/admin/clientManagement.service';
import { AllocatedContact } from './../../../../../models/allocatedContact';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {OrderFilter} from "./../../../../../models/orderFilter";
import {Pagination} from "./../../../../../models/pagination";
import { ExportCSV } from './../../../../../services/exportCSV.service';


const now = new Date();


@Component({
  selector: 'order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.css']
})
export class AllOrderComponent implements OnInit,AfterViewInit {
  public options: Select2Options;
  public value: string[];
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public contactList: Array<Contact> = [];
  public allocatedContact: Array<AllocatedContact> = [];
  public singleOptins:Select2Options;
  public orderList:Array<Order>= [];
  public extra:ExtraData;
  public location:Location;
  statusData;valueStatus;
  public induction:Induction;
  public mainOrderList:Array<Order> = [];
  public orderFilter: OrderFilter;
  public pagination:Pagination;


  @ViewChild(AgmMap) private map: any;
  @ViewChild('address') public contactAddressElm: ElementRef;

  public get client():Client {
    return this._clientService.client;
  }
  public set client(value: Client) {
    this._clientService.client = value;
  }
  
  public get project():Project {
    return this._projectService.project;
  }
  public set project(value: Project) {
    this._projectService.project = value;
  }

  public get order():Order {
    return this._orderService.order;
  }
  public set order(value: Order) {
    this._orderService.order = value;
  }

  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _orderService: AdminOrderService,
      private _projectService: ProjectManagement,
      private _clientService: ClientManagment,
      private _rootNode: ElementRef,
      public  commonService: CommonService,
      private router: Router,
      private mapsAPILoader: MapsAPILoader, 
      private ngZone: NgZone,
      private config: NgbDatepickerConfig,
      private _inductionService: InductionService,
      private exportCSV:ExportCSV
    )
  {
      this.initialization();
      config.minDate = {year: now.getFullYear()-1, month: now.getMonth() + 1, day: now.getDate()};
      config.maxDate = {year: now.getFullYear()+30, month: now.getMonth() + 1, day: now.getDate()};
  }

  initialization(){
      this.userType = new UserType(5,'client');
      this.user = new User (0,"","","","","");
      this.contact = new Contact();
      this.contact.user.userType = this.userType;
      this.order = new Order();
      this.location = new Location();
      this.extra = new ExtraData();
      this.induction = new Induction();
      this.orderFilter = new OrderFilter();
      this.pagination = new Pagination();
  }

  ngOnInit(){

    if(this.project.id == 0) { 
        this.router.navigate(['/clients']);
    } else { 
      window.scrollTo(0, 0); 
      this.statusData = ["Pending", "Approved", "Rejected"]
      this.value = [];
      this.valueStatus = [];
      this.options = {
        multiple: true
      }
      this.singleOptins = {
        multiple: false
      }
      this.getOrderList();
      this.validationForm.floatLabel();
      this.findLocation();
      this.getAddress();
      this.intContactList();
    }
      
  }
  ngAfterViewInit(){
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#addOrder');
  }

  orderdata(data){
    // console.log(data);
    this.order = data;
    this.router.navigate(['/single-client-order']);
  }

  backToClient(){
    this.client = this.project.client;
  }

  getAddress(){
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.contactAddressElm.nativeElement, { types:["address"] });
                autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => { 
                   let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                       // console.log(place);
                      this.contact.address = place.formatted_address;
                });
            });
        });
  }

  findLocation(){
        let x;
        if(this.project.projectAddress!=null||this.project.projectAddress!=''){
            this.commonService.getLocation(this.project.projectAddress)
            .then((response) => { 
              if(response.results.length>0){
                  x = response.results[0].geometry.location;
                  // console.log(x);
                  this.location.lat = x.lat;
                  this.location.lng  = x.lng;
                  this.commonService.redrawMap(this.map,this.location.lat,this.location.lng);
              }
            })
            .catch((error) => console.error(error));
        }
    }

  loadPage(page: number) {
      this.pagination.page = page;
      this.getOrderList();
  }

  getOrderList(){
    let arr:any = {};
        arr.id = this.project.id;
    this._orderService.getProjectOrders(arr).subscribe(
      res=> {
        // console.log(res);
        this.orderList = res.data;
        this.pagination.total_items_count = res.total_items_count;
        this.pagination.pageSize = res.items_per_page;
      },
      // err=> console.log(err)
    );
  }

  initContactDetails(f){

    if(f.id==0){
       for(let x of this.client.allocatedContact){
        if(f.contact.id==x.contact.id){
          this.contact = x.contact;
        }
      }
    } else this.contact = f.contact;
  }

  inductionDetails(f){
    if(f.hasOwnProperty('induction')) this.induction = f.induction;
    else this.induction = f;

  }

  colorContact(i){
    return this._contactService.colorContact(i);
  }


  intContactList() {
    this.contactList = this._contactService.getSelectedCon(this.project.client.allocatedContact);

  }

  changed(data: {value}) {
    this.valueStatus = data.value;
    this.order.orderStatus = this.valueStatus;
  }



    addContactToAllocation(data: {value: string[]}, order) {
        // console.log(data);
        let alocContacts: Array<AllocatedContact> = [];
        for (var i=0; i < data.value.length; i++) {
            let aloc = new AllocatedContact();
            aloc.id = this.findAlloctedContactIdByContactId(data.value[i]);
            aloc.contact.id = data.value[i];
            aloc.client = null;
            aloc.order = null;
            aloc.project = null;

            alocContacts.push(aloc);
        }

        this.order.allocatedContact = alocContacts;

        // console.log(this.order.allocatedContact);

    }

    findAlloctedContactIdByContactId(id) {
       let x = '0';
        for(var i=0; i < this.allocatedContact.length; i++) {

            if(this.allocatedContact[i].contact.id == id) {
                x = this.allocatedContact[i].id;

            }
        }
        return x;
    }

  initAddOrder(){
    this.order = new Order;
    this.order.project = JSON.parse(JSON.stringify(this.project));
    this.value = [];
    this.valueStatus = 'Pending'
    this.allocatedContact = this.order.allocatedContact;
    setTimeout(()=>this.validationForm.floatLabel(),100);
  }


  addOrder(f){ 
    this.extra.loader = true;
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
                this.extra.modalElOpen.modal('hide');
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

  initContact(f) {
    this.contact = new Contact();
    this.extra.modalEl.modal('hide');
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
    this.validationForm.contactModalScroll('#contact');
    this.validationForm.floatLabel();
  }

  addContact(f){
    this.extra.loader = true;
    this._contactService.add(this.contact, this.client).subscribe(
        response => {
          this.extra.code = response.code;
          // console.log(response);
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.validationForm.successRes(response,f,this.extra);
            this.extra.modalEl.modal('hide');
            this.addAllocatedContactClient(response.Contact);
            this.intContactList(); 
            this.validationForm.openModalScroll('#addOrder','#contact');
            this.extra.modalElOpen.modal('show');
          }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        });
  }
  //
  addAllocatedContactClient(con){
    let allocatedCon = new AllocatedContact();
    allocatedCon.contact = con;
    allocatedCon.client = new Client();
    allocatedCon.client.id = this.client.id;
    allocatedCon.project = new Project();
    allocatedCon.project.id = this.project.id;
    this.project.client.allocatedContact.push(allocatedCon);
  }

  

  reset(f){
    f.form.reset();
    this.validationForm.floatLabel();
  }

  editOrder(data, allocatedCon){
    this.allocatedContact = data.allocatedContact;
    this.extra.editTrue = true;
    this.order = new Order();
    this.order = data;
    this.order.allocatedContact = allocatedCon;
    this.order.endDate = this.validationForm.convertToCustomDate(data.endDate);
    this.order.startDate = this.validationForm.convertToCustomDate(data.startDate);
    this.valueStatus = data.orderStatus;
    this.value = this._projectService.getIds(allocatedCon,'contact');
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }
  onUpdate (){
    this.extra.loader = true;
    this.order.firstTime = null;
        this._orderService.update(this.order).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else{
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
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

  getContactname(id){
    for(let x of this.client.allocatedContact){
      if(id==x.contact.id){
        return x.contact.emargencyContact;
      }
    }
    return '';
  }

  /******Advance Search************/
  trackOrder(index,order){
    return order? order.id : undefined;
  }

  toggelIcon(){
    this.extra.con = !this.extra.con;
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

  /***********Export CSV****************/

  downLoadCSV(){
    if(this.orderList){
      let formtedData = this._orderService.formatCSVData(this.orderList);
      this.exportCSV.downloadCSV({ filename: "Order-Data-Table.csv", title:'Order List' }, formtedData);
    }
  }


  
}
