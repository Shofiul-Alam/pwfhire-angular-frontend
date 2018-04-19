import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Project } from './../../../../../models/project';
import { User } from './../../../../../models/user';
import { Contact } from './../../../../../models/contact';
import { UserType } from './../../../../../models/UserType';
import { ValidationService } from './../../../../../services/formValidation.service';
import { ContactManagment } from './../../../../../services/admin/contactManagement.service';
import {Client} from './../../../../../models/client';
import { ClientManagment } from './../../../../../services/admin/clientManagement.service';
import { ProjectManagement } from './../../../../../services/admin/projectManagement.service';
import {AllocatedContact} from "../../../../../models/allocatedContact";
import {AllocatedSkillCompetency} from "../../../../../models/allocatedSkillCompetency";
import {Router} from '@angular/router';
import {APIServices} from "../../../../../services/apiServices.service";
import {InductionService} from "../../../../../services/admin/adminInduction.service";
import {Induction} from "./../../../../../models/Induction";
import {ExtraData} from  './../../../../../models/extraData';
import {AllocatedInduction} from "../../../../../models/allocatedInduction";




@Component({
  selector: 'edit-project-form',
  templateUrl: 'editProjectForm.component.html',
  styleUrls: ['editProjectForm.component.css']
})
export class EditProjectFormComponent implements OnInit {
  public contactValue: string[];
  public inductionValue: string[];
  public inductionArray: Array<Induction>;
  public options: Select2Options;
  public singleOptins:Select2Options;
  public contacts: string[];
  public contactList: Array<Contact>;
  public allocatedContact: Array<AllocatedContact> = [];
  public allocatedInduction: Array<AllocatedInduction> = [];
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public client: Client;
  public clientArray: Array<Client>= [];
  public clientValue:string[];
  public extra:ExtraData;

    public get project():Project {
        return this._projectService.project;
    }
    public set project(value: Project) {
        this._projectService.project = value;
    }

  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _clientService: ClientManagment,
      private router: Router,
      private _rootNode: ElementRef,
      private _projectService: ProjectManagement,
      private _inductionService: InductionService,
      private apiService: APIServices
    )
  {
      this.init();
  }

  init(){
    this.userType = new UserType(5,'client');
    this.user = new User (0,"","","","","");
    this.contact = new Contact();
    this.contact.user.userType = new UserType(0, 'contact');
    this.extra = new ExtraData();
  }

  @ViewChild('contactAddress') public contactAddressElm: ElementRef;
  @ViewChild('projectAddress') public projectAddressElm: ElementRef;


  ngOnInit() {
      window.scrollTo(0, 0);
      window.sessionStorage.removeItem('address');
      if(this.project.id == 0) {
            this.router.navigate(['/projects']);
      }
      // console.log(this.project);
      this.options = {
          multiple: true
      }
      this.singleOptins = {
          multiple: false
      }

      this.getAddress();
      this.clientList();
      this.getInductionList();
      setTimeout(()=>{this.validationForm.floatLabel()},100);
      this.allocatedContact = this.project.allocatedContact;
  }


  getAddress(){
        this.apiService.contactAddress(this.contactAddressElm.nativeElement);
        this.apiService.addressAutoComplete(this.projectAddressElm.nativeElement);
    }

  getInductionList(){
    this._inductionService.allInduction().subscribe(
      response => {
        this.inductionArray = this._projectService.addText(response.data,'name');
        // console.log(this.inductionArray);
        this.inductionValue = this._projectService.getIds(this.project.allocatedInduction,'induction');
        this.allocatedInduction = this.project.allocatedInduction;
      },
        error => console.log(<any> error)
    );   
  }

  Inductionchanged(data) {
      // console.log(data);
      this.project.allocatedInduction = this._projectService.addAllocatedInduction(data.value,this.allocatedInduction,'induction');
      // console.log(this.project.allocatedInduction);
  }



  clientList() {
    this.project.client['text'] = this.project.client.companyName;
    this.clientArray = [this.project.client];
    this.clientValue = [this.project.client.id.toString()];
    this.intContactList();
  }

    intContactList() {
        this.contactList = this._projectService.contactList(this.project.client.allocatedContact);
        // console.log(this.contactList);
        this.contactValue = this._projectService.getIds(this.project.allocatedContact,'contact');
    }

    addContactToAllocation(data: {value: string[]}) {
        this.project.allocatedContact = this._projectService.addAllocatedContact(data.value,this.allocatedContact,'contact');
        // console.log(this.project.allocatedContact);
    }

    getProjectAddress(){
      let address = JSON.parse(sessionStorage.getItem('address'));
      if(address!=null){
        this.project.projectAddress = address.address;
        this.project.lattitude = address.lat;
        this.project.longitude = address.lng;
      }
    }

    onUpdate(f) {
        this.project.allocatedSkillCompetency = null;
        this.project.firstTime = null;
        this.getProjectAddress();
        this.extra.loader = true;
        // console.log(this.project);
        this._projectService.update(this.project).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                   this.validationForm.getResponce(response,this.extra);
                } else{
                   this.validationForm.getResponce(response,this.extra);
                   window.sessionStorage.removeItem('address');
                }
            },
            error => {
                // console.log(<any> error);
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
        this.contact.id = '0';
        this.contact.address = sessionStorage.getItem('conAddress');
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
                    this.project.client.allocatedContact = this.client.allocatedContact;
                    this.intContactList();
                    this.validationForm.successRes(response,f,this.extra);
                    this.extra.modalEl.modal('hide');
                    window.sessionStorage.removeItem('conAddress');
                }
            },
            error => {
                // console.log(<any> error);
                this.extra.loaderadd = false;
                this.validationForm.errorStatus(error,this.extra);
            });
    }


  reset(f){
      f.form.reset();
      this.validationForm.floatLabel();
    }

  

}
