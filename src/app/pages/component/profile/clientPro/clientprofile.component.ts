import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import { User } from './../../../../models/user';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { UserType } from './../../../../models/UserType';
import { Client } from '../../../../models/client';
import { Select2OptionData } from 'ng2-select2';
import {ValidationService} from './../../../../services/formValidation.service';
import {SkillCompetencyList} from './../../../../models/SkillCompetencyList';
import { SkillCompetencyManagement } from './../../../../services/admin/adminSkillCompetency.service';
import {Router} from '@angular/router';
import {UploadService} from "../../../../services/upload.service";
import {ClientDocument} from "./../../../../models/clientDoc";
import {ClientUploadDoc} from "./../../../../models/clientUploadDoc";
import {Contact} from "../../../../models/contact";
import {ContactManagment} from "../../../../services/admin/contactManagement.service";
import {SelectOp} from "../../../../models/select2";
import {AllocatedContact} from "../../../../models/allocatedContact";
import {APIServices} from "../../../../services/apiServices.service";
import {ClientService} from "../../../../services/client.service";
import {ExtraData} from "../../../../models/extraData";




@Component({
  selector: 'client-profile',
  templateUrl: 'clientprofile.component.html',
  styleUrls: ['clientprofile.component.css']
})
    
export class ClientProfileComponent implements OnInit, AfterViewInit {
    public options: Select2Options;
    public value: string[];
    public client:Client;
    public user:User;
    public checkPass: string;
    public skillCompetencyArray: Array<SkillCompetencyList>;
    public skillCompetency: SkillCompetencyList;
    public filesToUpload: Array<File>;
    public docUpload: any;
    public clientFile: ClientDocument;
    public clientDoc:ClientUploadDoc;
    public contact: Contact = new Contact;
    public contactList: Array<Contact> = [];
    public allocatedContacts: Array<AllocatedContact> = [];
    public selectO: SelectOp = new SelectOp();
    public extra:ExtraData;


    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('contactAddress') public searchElement: ElementRef;

    constructor(
        public validationForm: ValidationService,
        private _clientApi: ClientService,
        private _skillcompetencyService: SkillCompetencyManagement,
        private router: Router,
        private _uploadService: UploadService,
        private _contactService: ContactManagment,
        config: NgbDatepickerConfig,
        private apiService: APIServices,
        private _rootNode: ElementRef
    ){

        this.contact.user.userType = new UserType(0, 'contact');
        this.client = new Client();
        this.checkPass = '';
        config.minDate = {year: 1950, month: 1, day: 1};
        config.maxDate = {year: 2099, month: 12, day: 31};
        this.extra = new ExtraData();

    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.getClient();
        this.getAddress();
        console.log(this.client);

        this.skillCompetency = new SkillCompetencyList();
        this.clientFile = new ClientDocument ();
        this.clientDoc = new ClientUploadDoc();

        let userType = new UserType(5, "client");

        this.listData();
        this.intContactList();
        this.options = {
            multiple: true
        };

        this.validationForm.floatLabel();
    }

    ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  getClient(){
        this._clientApi.getUser().subscribe(
            userData => {
                this.client = userData;
                if ( this.client.invoiceDueDate != null ){
                    var date = this.validationForm.convertToCustomDate(userData.invoiceDueDate)
                    this.client.invoiceDueDate = date;
                }
                this.getContacts();
                setTimeout(()=>{ this.validationForm.floatLabel()},100);
            },
            error => {
                console.log(<any> error);
            }
        );
    }

  

  getAddress(){
        this.apiService.contactAddress(this.searchElement.nativeElement);
    }

    getContacts() {
        this.allocatedContacts = this.client.allocatedContact;
        if(this.allocatedContacts.length > 0) {
            let conId = [];
            for(let con of this.allocatedContacts) {
                if(con.contact!=null) conId.push(con.contact.id);
            }
           this.value = conId;
            console.log(this.value);
        }
    }

    intContactList() {
    console.log(this.contactList.length);
      this._contactService.allContact().subscribe(
          response => {
            if(response.code == 200) {
              this.contactList = response.data;
              for(var i = 0; i < this.contactList.length; i++ ) {
                this.contactList[i].text = this.contactList[i].emargencyContact + " (" + this.contactList[i].landPhone + ")";
              }
              console.log(this.contactList);
              this.getContacts();
            }
          }
      )
  }

    addContactToAllocation(data: {value: string[]}) {
    console.log(this.allocatedContacts);
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

    console.log(this.allocatedContacts);
  }

  findAlloctedContactIdByContactId(id) {
    console.log(id);
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

    initUploadDoc(f){
        f.form.reset();
        this.clientDoc = new ClientUploadDoc();
        setTimeout(()=>this._uploadService.avatarUpload(),100)
    }

    initEditUploadDoc(f){
        this.extra.editTrue = true;
        this.clientDoc = f;
    }

    addDocument (f){
        this.clientDoc.client = this.client;
        this.clientFile = this.docUpload;
        this.extra.loader = false;
        this.extra.loader = true;
        console.log(this.clientDoc,this.clientFile);
        setTimeout(()=>{
            this.extra.modalEl.modal('hide');
            this.extra.loader = false;
        },5000);
    }

    updateDocument(){
        this.extra.editAvatar= false;
    }

    updatedata(f)
    {
        this.extra.loader = true;
        console.log(this.client,this.docUpload);
        this._clientApi.update(this.client,this.docUpload).subscribe(
            response => {
                this.extra.code = response.code;
                console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this._clientApi.changeUserData(response.data);
                    this.client = response.data;
                    if ( this.client.invoiceDueDate != null ){
                        let date = this.validationForm.convertToCustomDate(this.client.invoiceDueDate)
                        this.client.invoiceDueDate = date;
                    }
                    this.extra.editAvatar = false;
                    this.validationForm.getResponce(response,this.extra);
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );


    }


    listData (){
        this._skillcompetencyService.getAll().subscribe(
            response => {
                this.skillCompetencyArray = response.data;
                if(response.code==200){
                    for(var i = 0; i < this.skillCompetencyArray.length; i++ ) {
                    this.skillCompetencyArray[i].text = this.skillCompetencyArray[i].name;
                    }
                }
            },
            error => {
                console.log(<any> error);
            }
        );
    }


    fileChangeEvent(fileInput:any, b:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        let bar = b;
        let token;
        let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
        this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload,bar).then(
            (result) => {
                this.docUpload = result['upload'];
            },
            (error) => {
                console.log(error);
            });
    }
    clearFile() {
        this.fileInput.nativeElement.value = '';
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
        this._contactService.add(this.contact, null).subscribe(
            response => {
                console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.extra.loaderadd = false;
                    window.sessionStorage.removeItem('conAddress');
                    this.validationForm.successRes(response,f,this.extra);
                    this.intContactList();
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loaderadd = false;
            });
    }

    reset(f){
        f.form.reset();
        window.sessionStorage.removeItem('conAddress');
        this.extra.editTrue = false;
        this.extra.editAvatar= false;
    }

    editAvatarClick(){
        this.extra.editAvatar = true;
        setTimeout(()=>this._uploadService.avatarUpload(),100)
    }
    cancelAvatarClick(){
         this.extra.editAvatar = false;
    }

    /* reset email and update password  */

    initUpdatePass(){
        this.extra.con = true;
        setTimeout(()=>this.validationForm.floatLabel(),100);
    }

    initResetEmail(){
        this.extra.con = false;
        setTimeout(()=>this.validationForm.floatLabel(),100);
    }

    updatePass(){

    }

    resetEmail(){

    }

}
