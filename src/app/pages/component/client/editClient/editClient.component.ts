import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import {ClientManagment} from './../../../../services/admin/clientManagement.service';
import { User } from './../../../../models/user';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Client } from './../../../../models/client';
import { Select2OptionData } from 'ng2-select2';
import { ValidationService } from './../../../../services/formValidation.service';
import {UserType} from "./../../../../models/UserType";
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
import {ExtraData} from './../../../../models/extraData';
import {AdminGLOBAL} from './../../../../services/admin/adminGlobal';




@Component({
    selector: 'client-editForm',
    templateUrl: 'editClient.component.html',
    styleUrls: ['editClient.component.css'],
    providers: [NgbDatepickerConfig]
})
export class EditClientComponent implements OnInit, AfterViewInit {
    public options: Select2Options;
    public value: string[];
    public user:User;
    public url = AdminGLOBAL.url;
    public checkPass: string ='';
    public skillCompetencyArray: Array<SkillCompetencyList>;
    public skillCompetency: SkillCompetencyList;
    public filesToUpload: Array<File>;
    public docUpload: any;
    public clientFile: ClientDocument;
    public clientDoc:ClientUploadDoc;
    public contactList: Array<Contact> = [];
    public contact: Contact = new Contact;
    public allocatedContacts: Array<AllocatedContact> = [];
    public selectO: SelectOp = new SelectOp();
    public extra:ExtraData;
    

    public get client():Client {
        return this._clientservice.client;
    }
    public set client(value: Client) {
        this._clientservice.client = value;
    }

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('contactAddress') public searchElement: ElementRef;

    constructor(
        public validationForm: ValidationService,
        private _clientservice: ClientManagment,
        private _skillcompetencyService: SkillCompetencyManagement,
        private router: Router,
        private _uploadService: UploadService,
        private _contactService: ContactManagment,
        config: NgbDatepickerConfig,
        private apiService: APIServices,
        private _rootNode: ElementRef
    ){

        this.contact.user.userType = new UserType(0, 'contact');

        this.checkPass = '';
        config.minDate = {year: 1950, month: 1, day: 1};
        config.maxDate = {year: 2099, month: 12, day: 31};

    }
    ngOnInit() {
        window.scrollTo(0, 0);
        if(this.client.id == 0) { 
            this.router.navigate(['/clients']);
        }

        this.getAddress();
        // console.log(this.client);
        this.allocatedContacts = this.client.allocatedContact;
        this.extra = new ExtraData();
        this.skillCompetency = new SkillCompetencyList();
        this.clientFile = new ClientDocument ();
        this.clientDoc = new ClientUploadDoc();


        this.intContactList();

        let userType = new UserType(5, "client");

        this.listData();
        
        this.options = {
            multiple: true
        };

        this.validationForm.floatLabel();
    }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  addContactToAllocation(data: {value: string[]}) {

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
      for(var i=0; i<this.allocatedContacts.length; i++) {
          if(this.allocatedContacts[i].contact.id == id) {
              return this.allocatedContacts[i].id;
          } else {
              return '0';
          }
      }
  }


  getAddress(){
    this.apiService.contactAddress(this.searchElement.nativeElement);
  }

  getContacts() {
        if(this.allocatedContacts.length > 0) {
            let conId = [];
            for(var i=0; i<this.allocatedContacts.length; i++) {
                conId.push(this.allocatedContacts[i].contact.id);
            }
           this.value = conId;
            // console.log(this.value);
        }
    }

    intContactList() {
        this._contactService.allContact().subscribe(
            response => {
                if(response.code == 200) {
                    this.contactList = response.data;
                    // console.log(this.contactList);
                    this.getContacts();
                }
            }
        )
    }


    initUploadDoc(f){
        f.form.reset();
        this.clientDoc = new ClientUploadDoc();
        setTimeout(()=>this._uploadService.avatarUpload(),100)
    }

    initEditUploadDoc(){
        this.extra.editTrue = true;
        // this.clientDoc = f;
    }

    addDocument (f){
        this.clientDoc.client = this.client;
        this.clientFile = this.docUpload;
        this.extra.loader = false;
        this.extra.loader = true;
        // console.log(this.clientDoc,this.clientFile);
        setTimeout(()=>{
            this.extra.modalEl.modal('hide');
            this.extra.loader = false;
        },5000);
    }

    updateDocument(){
        this.extra.editAvatar= false;
    }

    onSubmit(f)
    {
        this.extra.loader = true;
        this.client.allocatedContact = this.allocatedContacts;
        this.client.splicedAllocatedContact = null;
        // console.log(this.client,this.docUpload);
        this._clientservice.updateDataWithAvatar(this.client,this.docUpload).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.client = response.data;
                    this.extra.editAvatar = false;
                    this.validationForm.getResponce(response,this.extra);
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
        this._contactService.add(this.contact, null).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.extra.loaderadd = false;
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.validationForm.successRes(response,f,this.extra)
                    this.extra.modalEl.modal('hide');
                    this.extra.loaderadd = false;
                    window.sessionStorage.removeItem('conAddress');
                    this.intContactList();
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            });
    }



    listData (){
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
                // console.log(error);
            });
    }
    clearFile() {
        this.fileInput.nativeElement.value = '';
    }


    reset(f){
        f.form.reset();
        window.sessionStorage.removeItem('address');
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

    findById(input, id) {

        for (var i = 0; i<input.length; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    };

}


