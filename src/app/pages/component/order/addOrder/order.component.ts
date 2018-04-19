import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,NgZone } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Order } from './../../../../models/order';
import { Project } from './../../../../models/project';
import { CommonService } from './../../../../services/common.service';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import {Client} from './../../../../models/client';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import { ContactManagment } from './../../../../services/admin/contactManagement.service';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {APIServices} from "../../../../services/apiServices.service";
import {ExtraData} from "./../../../../models/extraData";
import { AdminOrderService } from './../../../../services/admin/adminOrder.service';
import { AllocatedContact } from './../../../../models/allocatedContact';
import {Router} from '@angular/router';
import { ProjectManagement } from './../../../../services/admin/projectManagement.service';
import { AgmMap, AgmMarker } from '@agm/core';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-order-basic',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.css']
})
export class OrderComponent implements OnInit {
  public options: Select2Options;
  public singleOptins:Select2Options;
  public value:string[] = [];
  public valueStatus:any;
  public order: Order;
  public project: Project;
  public projectArray:Array<Project>= [];
  public projectValue:string[] = [];
  public statusData; 
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public contactList: Array<Contact> = [];
  public allocatedContact: Array<AllocatedContact> = [];
  public client: Client;
  public clientArray: Array<Client>= [];
  public clientValue:string[] = [];
  public extra:ExtraData; 

  

  @ViewChild('address') public contactAddressElm: ElementRef;

  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _comService:CommonService,
      private _clientService: ClientManagment,
      // private apiService: APIServices,
      private mapsAPILoader: MapsAPILoader, 
      private ngZone: NgZone,
      private router: Router,
      private _projectService: ProjectManagement,
      private _orderService: AdminOrderService,
      private _rootNode: ElementRef
  ){
    this.project = new Project();
    this.order = new Order();
    this.extra = new ExtraData();
    this.userType = new UserType(5,'client');
    this.user = new User (0,"","","","","");
    this.contact = new Contact();
    this.contact.user.userType = this.userType;
  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.statusData = ["Pending", "Approved", "Rejected"];
    this.options = {
      multiple: true
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
  }

  // getAddress(){
  //   this.apiService.contactAddress(this.contactAddressElm.nativeElement);
  // }

  getAddress(){
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.contactAddressElm.nativeElement, { types:["address"] });
                autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => { 
                   let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                     this.contact.address = place.formatted_address; 
                     console.log(this.contact);
                });
            });
        });
  }



  changed(data) {
    this.valueStatus = data.value;
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
          // console.log(this.client);
          this.projectList();
          this.intContactList();
          // this.order.project.client = this.client;
      }
    }

  projectList(){
    this._projectService.getClientProjects(this.client.id).subscribe(
      response=> {
        if(response.code == 200) {
          this.projectArray = this._projectService.addText(response.data,'projectName');
          this.extra.editTrue = false;
          // console.log(this.projectArray);
        }
      },
      error => console.log(<any> error)
    );
  }

  projectChanged(data){
    let x = this._projectService.findById(this.projectArray, data.value);
    this.order.project = !x? '':x;
    // console.log(this.order.project);
  }

  intContactList() {
    this.contactList = this._contactService.getSelectedCon(this.client.allocatedContact);
    // console.log(this.contactList);
  }

  addContactToAllocation(data: {value: string[]}) {
    this.order.allocatedContact = this._projectService.addAllocatedContact(data.value,this.allocatedContact,'contact');
    // console.log(this.order.allocatedContact);
  }


  addOrder(f){ 
    this.extra.loader = true;
    this.order.orderStatus = !this.valueStatus? 'Pending':this.valueStatus;
    // console.log(this.order);
    this._orderService.add(this.order).subscribe(
      response => {
            this.extra.code = response.code;
            // console.log(response);
            if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
            } else{
                this.validationForm.successRes(response,f,this.extra);
                this.router.navigate(['/orders']);
            }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        }
    );
  }

  initContact() {
    window.sessionStorage.removeItem('conAddress');
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
    // console.log(this.contact);
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
            window.sessionStorage.removeItem('conAddress');
        }
      },
      error => {
        console.log(<any> error);
        this.extra.loaderadd = false;
        this.validationForm.errorStatus(error,this.extra);
    });
  }


  reset(f){
    f.form.reset();
  }

 


}
