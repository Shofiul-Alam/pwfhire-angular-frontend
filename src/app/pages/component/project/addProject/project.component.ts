import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone,HostListener } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Project } from './../../../../models/project';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import { ContactManagment } from './../../../../services/admin/contactManagement.service';
import {SkillCompetencyList} from './../../../../models/SkillCompetencyList';
import {Client} from './../../../../models/client';
import {ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ProjectManagement } from './../../../../services/admin/projectManagement.service';
import {AllocatedContact} from "../../../../models/allocatedContact";
import {Router} from '@angular/router';
import {APIServices} from "../../../../services/apiServices.service";
import {InductionService} from "../../../../services/admin/adminInduction.service";
import {Induction} from "./../../../../models/Induction";
import {ExtraData} from  './../../../../models/extraData';
import {AllocatedInduction} from "../../../../models/allocatedInduction";
import { AgmMap, AgmMarker } from '@agm/core';
import { MapsAPILoader } from '@agm/core';



@Component({
  selector: 'project-form',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectFormComponent implements OnInit, AfterViewInit {
  public contactValue: string[];
  public compentencyValue: string[];
  public options: Select2Options;
  public singleOptins:Select2Options;
  public contacts: string[];
  public contactList: Array<Contact>;
  public allocatedContact: Array<AllocatedContact> = [];
  public allocatedInduction: Array<AllocatedInduction> = [];
  public inductionArray: Array<Induction>;
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
      private _projectService: ProjectManagement,
      private router: Router,
      private _rootNode: ElementRef,
      private _inductionService: InductionService,
      private apiService: APIServices,
      private mapsAPILoader: MapsAPILoader, 
      private ngZone: NgZone
    )
  {
      this.init();
  }

  init(){
    this.project = new Project();
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
      this.clientValue = [];
      this.contactValue = [];
      this.compentencyValue = [];
      this.options = {
          multiple: true
      }
      this.singleOptins = {
          multiple: false
      }

      this.getProjectAddress();
      this.clientList();
      this.getInductionList();
      this.validationForm.floatLabel();
  }
  ngAfterViewInit(){
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  @ViewChild(AgmMap) private map: any;

  getAddress(dom){
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(dom, { types:["address"] });
                autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => { 
                   let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                   if(this.projectAddressElm.nativeElement==dom){
                     this.project.projectAddress = place.formatted_address;
                     this.project.lattitude = place.geometry.location.lat();
                     this.project.longitude = place.geometry.location.lng();
                     this.apiService.redrawMap(this.map,this.project.lattitude,this.project.longitude);
                   } else this.contact.address = place.formatted_address; 
                });
            });
        });
  }

  getProjectAddress(){
        this.getAddress(this.contactAddressElm.nativeElement);
        this.getAddress(this.projectAddressElm.nativeElement);
    }

  getInductionList(){
    this._inductionService.allInduction().subscribe(
      response => {
        this.inductionArray = this._projectService.addText(response.data,'name');
          // console.log(this.inductionArray);
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
      // console.log(this.clientArray.length);
      this._clientService.allClientList().subscribe(
         response => {
            if(response.code == 200) this.clientArray = this._projectService.addText(response.data,'companyName');
         },
         error =>  console.log(<any> error)
      );
    }

    clientChanged(data: {value: string[]}){
      this.client = this._projectService.findById(this.clientArray, data.value);
      if(this.client != null) {
          // console.log(this.client);
          this.project.client = this.client;
          this.intContactList();
      }
    }

    intContactList() {
        // console.log(this.allocatedContact);
        this.contactList = this._projectService.contactList(this.client.allocatedContact);
        // console.log(this.contactList);
    }

    addContactToAllocation(data: {value: string[]}) {
        this.project.allocatedContact = this._projectService.addAllocatedContact(data.value,this.allocatedContact,'contact');
        // console.log(this.project.allocatedContact);
    }

    onSubmit(f) {
        this.getProjectAddress();
        this.extra.loader = true;
        // console.log(this.project);
        this._projectService.add(this.project).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else{
                    this.validationForm.successRes(response,f,this.extra);
                    window.sessionStorage.removeItem('address');
                    this.project = response.Project;
                    setTimeout(()=>this.router.navigate(['/edit-project']),2000);
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
                console.log(<any> error);
                this.extra.loaderadd = false;
                this.validationForm.errorStatus(error,this.extra);
            });
    }

  reset(f){
    f.form.reset();
    this.validationForm.floatLabel();
  }




}
