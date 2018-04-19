import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import { Client } from './../../../../models/client';
import {Router} from '@angular/router';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ContactManagment} from "../../../../services/admin/contactManagement.service";
import {UploadService} from "../../../../services/upload.service";
import {APIServices} from "../../../../services/apiServices.service";
import {AllocatedContact} from "../../../../models/allocatedContact";
import {ExtraData} from './../../../../models/extraData';


@Component({
  selector: 'add-client',
  templateUrl: 'addclient.component.html',
  providers: [NgbDatepickerConfig]
})
export class AddClientComponent implements OnInit, AfterViewInit {
  public options: Select2Options;
  public value: string[];
  public userType: UserType;
  public contact: Contact;
  public contactList: Array<Contact> = [];
  public allocatedContacts: Array<AllocatedContact> = [];
  public avatar:any;
  public checkPass:string = '';
  public extra:ExtraData;
  public filesToUpload: Array<File>;

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
      private router: Router,
      private _contactService: ContactManagment,
      config: NgbDatepickerConfig,
      private _rootNode: ElementRef,
      private apiService: APIServices,
      private _uploadService: UploadService
  ) {
    config.minDate = {year: 1950, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
  }

  ngOnInit() {
    this.client = new Client();
    this.userType = new UserType(0,'client');
    this.client.user.userType = this.userType;
    this.extra = new ExtraData();
    this.getAddress();
    this.contact = new Contact();
    this.intContactList();
    window.scrollTo(0, 0);
    this.value = [];
    this.options = {
      multiple: true
    };
    this.validationForm.floatLabel();
    this._uploadService.avatarUpload();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  getAddress(){
    this.apiService.contactAddress(this.searchElement.nativeElement);
  }

  intContactList() {
    this._contactService.allContact().subscribe(
        response => {
          if(response.code == 200) {
            this.contactList = response.data;
            // console.log(this.contactList);
            for(var i = 0; i < this.contactList.length; i++ ) {
              this.contactList[i].text = this.contactList[i].emargencyContact + " (" + this.contactList[i].landPhone + ")";
            }
          }
        }
    );
  }
  addContactToAllocation(data: {value: string[]}) {
    this.allocatedContacts = [];
      for (var i=0; i < data.value.length; i++) {
        let aloc = new AllocatedContact();
        aloc.id = '0';
        aloc.contact.id = data.value[i];
        aloc.client = null;
        aloc.order = null;
        aloc.project = null;
        this.allocatedContacts.push(aloc);
      }
      // console.log(this.allocatedContacts);
  }

  onUpdate() {
    this.extra.loader = true;
    this.client.allocatedContact = this.allocatedContacts;
    // console.log(this.client);
    this._clientService.addDataWithAvatar(this.client, this.avatar).subscribe(
        response => {
              this.extra.code = response.code;
              // console.log(response);
              if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
              } else{
                this.validationForm.getResponce(response,this.extra);
                this.client = response.Client;
                this.router.navigate(['/edit-client']);
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
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
  }

  addContact(f){
    this.extra.loaderadd = true;
    this.contact.address = sessionStorage.getItem('conAddress');
    // console.log(this.contact)
    this._contactService.add(this.contact, null).subscribe(
        response => {
          // console.log(response);
          this.extra.code = response.code;
          if(response.code != 200) {
            this.extra.loaderadd = false;
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.intContactList();
            this.extra.modalEl.modal('hide');
            this.extra.loaderadd = false;
            this.validationForm.successRes(response,f,this.extra);
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
    window.sessionStorage.removeItem('conAddress');
  }

  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    let token;
    let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
    this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
      (result) => {
        // console.log(result['upload']);
        this.avatar = result['upload'];
      },
      (error) => {
        // console.log(error);
      });
  }


}
