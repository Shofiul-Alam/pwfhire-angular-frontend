import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import {Router} from '@angular/router';
import { Select2OptionData } from 'ng2-select2';
import { Client } from './../../../../models/client';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ContactManagment} from "../../../../services/admin/contactManagement.service";
import { CommonService } from './../../../../services/common.service';
import {APIServices} from "../../../../services/apiServices.service";
import {AllocatedContact} from "../../../../models/allocatedContact";
import {ExtraData} from './../../../../models/extraData';
import {Pagination} from "./../../../../models/pagination";
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {ClientFilter} from "./../../../../models/clientFilter";
import { ExportCSV } from './../../../../services/exportCSV.service';


@Component({
  selector: 'clients',
  templateUrl: 'clientList.component.html',
  styleUrls: ['clientList.component.css']
})
export class ClientListComponent implements OnInit,AfterViewInit {
  public options: Select2Options;
  public value: string[];
  public current: string;
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public contactList: Array<Contact> = [];
  public allocatedContacts: Array<AllocatedContact> = [];
  public clientEdit: Client;
  public extra:ExtraData;
  public pagination:Pagination;
  public checkPass:string = '';
  public clientList: Array<Client>;
  public mainClientList:Array<Client> = [];
  public clientFilter:ClientFilter;

  public get client():Client {
    return this._clientService.client;
  }
  public set client(value: Client) {
    this._clientService.client = value;
  }

  @ViewChild('contactAddress') public searchElement: ElementRef;

  constructor(
      public validationForm: ValidationService,
      private _clientService: ClientManagment,
      private _contactService: ContactManagment,
      private router: Router,
      config: NgbDatepickerConfig,
      private _rootNode: ElementRef,
      private apiService: APIServices,
      public  commonService: CommonService,
      private exportCSV:ExportCSV
    ) {
    
      this.client = new Client();
      this.userType = new UserType(0,'client');
      this.client.user.userType = this.userType;
      this.clearData();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      config.minDate = {year: 1950, month: 1, day: 1};
      config.maxDate = {year: 2099, month: 12, day: 31};
      this.clientFilter = new ClientFilter();
  }
  private clearData(){
    this.clientEdit = new Client();
    this.contact = new Contact();
    let userT = new UserType(0, 'contact');
  }

  ngOnInit() {
    this.contact = new Contact()
    window.scrollTo(0, 0);
    this.getAllClients();
    this.getAddress();
    this.value = [];
    this.options = {
      multiple: true
    }
    this.intContactList();
    this.current = this.value.join(' | ');
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#add');
  }

  getAddress(){
    this.apiService.contactAddress(this.searchElement.nativeElement);
  }

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page,page);
    this.getAllClients();
  }

  getAllClients(){
    // console.log(this.pagination.page);
    this._clientService.allClient(this.pagination.page).subscribe(
        response => {
          this.clientList = response.data;
          this.pagination.total_items_count = response.total_items_count;
          this.pagination.pageSize = response.items_per_page;
          // console.log(response);
        },
        error => {
          console.log(<any> error);
        }
    );
  }


  editClient(data){
    this.clearData();
    this.clientEdit = data;
    this.allocatedContacts = this.clientEdit.allocatedContact;
    // console.log(data,this.clientEdit.invoiceDueDate);
    this.clientEdit.invoiceDueDate = this.validationForm.convertToCustomDate(data.invoiceDueDate);
    setTimeout(()=>{this.validationForm.floatLabel()},100);
    this.value = this.commonService.getMultiSelectValue(data.allocatedContact,'contact');
    // console.log(this.value);
  }

  updateClient(f){
    this.clientEdit.allocatedContact = this.allocatedContacts;
    this.clientEdit.allContacts = null;
    // console.log(this.clientEdit);
    this.extra.loader = true;
    this._clientService.update(this.clientEdit).subscribe(
        response => {
          this.extra.code = response.code;
          // console.log(response);
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          }else {
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

  intContactList() {
    // console.log(this.contactList.length);
      this._contactService.allContact().subscribe(
          response => {
            if(response.code == 200) {
              this.contactList = response.data;
              for(var i = 0; i < this.contactList.length; i++ ) {
                this.contactList[i].text = this.contactList[i].emargencyContact + " (" + this.contactList[i].landPhone + ")";
              }
              // console.log(this.contactList);
            }
          }
      )
  }

  addContactToAllocation(data: {value: string[]}) {
    // console.log(this.allocatedContacts);
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
    if(alocContacts.length > 0) {
      this.allocatedContacts = alocContacts;
    }

    // console.log(this.allocatedContacts);
  }

  findAlloctedContactIdByContactId(id) {
    // console.log(id);
    if(this.allocatedContacts.length>0){
        for(var i=0; i<this.allocatedContacts.length; i++) {
        if(this.allocatedContacts[i].contact.id == id) {
          return this.allocatedContacts[i].id;
        } else {
          return '0';
        }
      }
    } else return '0';
  }

  initAdd(){
    this.clearData();
    this.value = []; 
    this.allocatedContacts = [];
  }

  addClient(f) {
        this.extra.loader = true;
        // console.log(this.client);
        this.client.allocatedContact = this.allocatedContacts;
        this._clientService.add(this.client).subscribe(
            response => {
              this.extra.code = response.code;
              // console.log(response);
              if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
              } else {
                this.validationForm.successRes(response,f,this.extra);
                this.clientList.push(response.Client);
                this.extra.modalEl.modal('hide');
                this.initAdd();
              }
            },
            error => {
              console.log(<any> error);
              this.validationForm.errorStatus(error,this.extra);
            }
        );
    }


  initContact(f) {
    window.sessionStorage.removeItem('conAddress');
    this.extra.modalEl.modal('hide');
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
    this.validationForm.contactModalScroll('#addContact');
  }

  addContact(f){
    this.extra.loader = true;
    this.contact.address = sessionStorage.getItem('conAddress');
    this._contactService.add(this.contact, null).subscribe(
        response => {
          // console.log(response);
          this.extra.code = response.code;
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.validationForm.successRes(response,f,this.extra);
            this.extra.modalEl.modal('hide');
            this.intContactList();
            this.validationForm.openModalScroll('#add','#addContact');
            this.extra.modalElOpen.modal('show');
            window.sessionStorage.removeItem('conAddress');
          }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        });
  }

    reset(f){
      f.form.reset();
      this.validationForm.floatLabel();
      window.sessionStorage.removeItem('conAddress');
    }

    openAddAfterAddContact(f){
      this.validationForm.openModalScroll('#add','#addContact');
      f.form.reset();
      this.validationForm.floatLabel()
      this.extra.modalElOpen.modal('show');
      window.sessionStorage.removeItem('address');
    }

  initArchive(data){
    this.client = JSON.parse(JSON.stringify(data));
    this.client.archived = true;
    this.extra.index = this.clientList.indexOf(data);
  }

  archiveData(){
    this.extra.loader = true;
    // console.log(this.client);
    this._clientService.isArchive(this.client).subscribe(
          response => {
            this.extra.code = response.code;
            if(response.code == 200){
              this.clientList.splice(this.extra.index,1);
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
  

  edit(client) {
    this.client = client;
    if(client.invoiceDueDate != null) {
      var date = this.validationForm.convertToCustomDate(client.invoiceDueDate);
      this.client.invoiceDueDate = date;
    }

    this.router.navigate(['/edit-client']);
  }
  manage(client) {
    this.client = client;
    if(client.invoiceDueDate != null) {
      var date = this.validationForm.convertToCustomDate(client.invoiceDueDate);
      this.client.invoiceDueDate = date;
    }
    sessionStorage.setItem('client',JSON.stringify(this.client))
    this.router.navigate(['/single-client']);
  }


  findById(input, id) {

    for (var i = 0; i<input.length; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  };

  trackClient(index,client){
    return client? client.id : undefined;
  }

  /*******Advance Filter**********/
  toggelIcon(){
    this.extra.loaderadd = !this.extra.loaderadd;
  }

  filterConChanged(data){
    this.clientFilter.allocatedContact = data.value;
  }

  searchFilterData(){
    if(!(this.mainClientList.length>0)) 
        this.mainClientList = this.clientList;
    let searchData = this._clientService.formateFilterData(this.clientFilter);
    // console.log(searchData);
    this.clientList = this._clientService.advanceFilter(this.mainClientList,searchData);
  }

  resetFilterData(){
    this.clientFilter = new ClientFilter();
    this.value = [];
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainClientList.length>0) 
      this.clientList = this.mainClientList;
      this.mainClientList = [];
  }

  /****************Download CSV***************/

  downLoadCSV(){
    let formtedData = this._clientService.formatCSVData(this.clientList);
    this.exportCSV.downloadCSV({ filename: "Client-Data-Table.csv", title:'Client List' }, formtedData);
  }



}
