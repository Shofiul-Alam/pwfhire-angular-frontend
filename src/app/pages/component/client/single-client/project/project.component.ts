import { Component, OnInit,ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Project } from './../../../../../models/project';
import { User } from './../../../../../models/user';
import { Contact } from './../../../../../models/contact';
import { AllocatedContact } from './../../../../../models/allocatedContact';
import { UserType } from './../../../../../models/UserType';
import { ValidationService } from './../../../../../services/formValidation.service';
import { ContactManagment } from './../../../../../services/admin/contactManagement.service';
import { AgmMap, AgmMarker } from '@agm/core';
import {Client} from './../../../../../models/client';
import { ClientManagment } from './../../../../../services/admin/clientManagement.service';
import { ProjectManagement } from './../../../../../services/admin/projectManagement.service';
import { CommonService } from './../../../../../services/common.service';
import {Router} from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {InductionService} from "../../../../../services/admin/adminInduction.service";
import {Induction} from "./../../../../../models/Induction";
import {ExtraData} from "./../../../../../models/extraData";
import {APIServices} from "../../../../../services/apiServices.service";
import {Pagination} from "./../../../../../models/pagination";
import {AllocatedInduction} from "../../../../../models/allocatedInduction";
import {ProjectFilter} from "./../../../../../models/projectFilter";
import { ExportCSV } from './../../../../../services/exportCSV.service';



@Component({
  selector: 'project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class AllProjectComponent implements OnInit,AfterViewInit {
  public contactValue: string[];
  public options: Select2Options;
  public contacts: string[];
  public contactList: Array<Contact> = [];
  public allocatedContact: Array<AllocatedContact> = [];
  public allocatedInduction: Array<AllocatedInduction> = [];
  public inductionArray: Array<Induction>;
  public inductionValue: Array<any>=[];
  public user: User;
  public extra:ExtraData;
  public userType: UserType;
  public contact: Contact;
  public clientArray: Array<Client>= [];
  public clientValue:string[];
  public clientDrop:Client;
  public clientContact:AllocatedContact;
  public projects:Array<Project> = [];
  public mainProjectList:Array<Project>;
  public proFilter:ProjectFilter;
  public pagination:Pagination;
  public induction:Induction;

  
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
  
  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _clientService: ClientManagment,
      private _rootNode: ElementRef,
      private router: Router,
      private _projectService: ProjectManagement,
      public  commonService: CommonService,
      private apiService: APIServices,
      private _inductionService: InductionService,
      private exportCSV:ExportCSV
    )
  {
      this.initialization();
  }

  initialization(){
      this.extra = new ExtraData();
      this.project = new Project();
      this.userType = new UserType(5,'client');
      this.user = new User (0,"","","","","");
      this.contact = new Contact();
      this.contact.user.userType = this.userType;
      this.contactDetailsInit();
      this.pagination = new Pagination();
      this.induction = new Induction();
      this.proFilter = new ProjectFilter();
  }

  contactDetailsInit(){
      this.clientContact = new AllocatedContact();
      this.clientContact.contact = this.contact;
      this.clientContact.project = this.project;
  }


  @ViewChild('contactAddress') public contactAddressElm: ElementRef;
  @ViewChild('projectAddress') public projectAddressElm: ElementRef;


  ngOnInit() {
    window.scrollTo(0, 0);
        if(this.client.id == 0) { 
            this.router.navigate(['/clients']);
        }
        sessionStorage.setItem('client',JSON.stringify(this.client));
        // console.log(this.client);
        this.getAllProject();
        this.resetMultiField();
        this.options = {
          multiple: true
        }
        this.initGoogleAutoComplete();
        this.intContactList();
        this.getInductionList();
        this.validationForm.floatLabel();
        this.clientList();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#addProject');
  }

  initGoogleAutoComplete(){
    this.apiService.addressAutoComplete(this.projectAddressElm.nativeElement);
    this.apiService.contactAddress(this.contactAddressElm.nativeElement);
  }

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page,page);
    this.getAllProject();
  }

  getAllProject() {
    this._projectService.getClientProjects(this.client.id).subscribe(
      response=> {
        this.projects = response.data;
        // console.log(response);
      });
  }
  

  getInductionList(){
    this._inductionService.allInduction().subscribe(
      response => {
        this.inductionArray = response.data;
          for(let i of this.inductionArray){
                i['text'] = i.name;
          }
          // console.log(this.inductionArray);
      },
        error => {
          console.log(<any> error);
        });   
  }

    Inductionchanged(data) {
      // console.log(data);
        let alocInductions: Array<AllocatedInduction> = [];
        for (var i=0; i < data.value.length; i++) {
            let alo = new AllocatedInduction();
            alo.id = this.findAlloctedInductionIdByInductionId(data.value[i]);
            alo.induction.id = data.value[i];
            alo.project = null;

            alocInductions.push(alo);
        }

        this.project.allocatedInduction = alocInductions;

        // console.log(this.project.allocatedInduction);

    }

    findAlloctedInductionIdByInductionId(id) {
        let x = '0';
        for(var i=0; i < this.allocatedInduction.length; i++) {
            // console.log(this.allocatedInduction);
            // console.log(this.allocatedInduction[i].induction.id );
            // console.log(id );
            if(this.allocatedInduction[i].induction.id == id) {
                x = this.allocatedInduction[i].id;

            }
        }
        return x;
    }

  colorContact(i){
    return this._contactService.colorContact(i);
  }

  initContactDetails(f){
    console.log(f);
    if(!f.hasOwnProperty('origId')||f.id==0){
       for(let x of this.client.allocatedContact){
        if(f.contact.id==x.contact.id){
          this.clientContact = x;
        }
      }
    } else this.clientContact = f;
  }

  inductionDetails(f){
      if(f.induction.name==''){
        this.induction = this.findProperInduction(f); 
      } else this.induction = f.induction;
    // console.log(f);
  }

  findProperInduction(f){
    let ind;
    for(let x of this.inductionArray){
      if(f.induction.id==x.id){
        ind = x;
        break;
      }
    }
    return ind;
  }


  clientList() {
        this.clientArray[0] = this.client;
        this.clientArray[0]['text'] = this.clientArray[0].companyName;
    }

  resetMultiField (){
    this.contactValue = [];
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

        this.project.allocatedContact = alocContacts;

        // console.log(this.project.allocatedContact);

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

  intContactList() {
    this.contactList = this._contactService.getSelectedCon(this.client.allocatedContact);
    // console.log(this.contactList);
  }

  initAddProject(){
    window.sessionStorage.removeItem('address');
    this.project = new Project();
    this.allocatedContact = this.project.allocatedContact;
    this.allocatedInduction = this.project.allocatedInduction;
    this.extra.editTrue = false;
    this.contactValue = [];
    this.inductionValue = [];
    this.project.client = this.client;
    // console.log(this.project);
    setTimeout(()=>{this.validationForm.floatLabel()},100);
    this.extra.loader = false;
  }

  getProjectAddress(){
    let address = JSON.parse(sessionStorage.getItem('address'));
    if(address!=null){
      this.project.projectAddress = address.address;
      this.project.lattitude = address.lat;
      this.project.longitude = address.lng;
    }
  }

  onSubmit(f) {
    this.extra.loader = true;
    this.getProjectAddress();
    // console.log(this.project);
    this._projectService.add(this.project).subscribe(
        response => {
            this.extra.code = response.code;
            // console.log(response);
            if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
            } else{
                this.projects.push(response.Project);
                this.validationForm.successRes(response,f,this.extra);
                this.extra.modalElOpen.modal('hide');
                this.initAddProject();
                window.sessionStorage.removeItem('address');
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
  this.validationForm.openModalScroll('#addProject','#addContact');
  this.extra.modalElOpen.modal('show');
}
  initContact() {
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
    this._contactService.add(this.contact, this.client).subscribe(
        response => {
          this.extra.code = response.code;
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.extra.modalEl.modal('hide');
            this.validationForm.successRes(response,f,this.extra);
            this.addAllocatedContactClient(response.Contact);
            this.intContactList();
            // console.log(this.client);
            this.validationForm.openModalScroll('#addProject','#addContact');
            this.extra.modalElOpen.modal('show');
            window.sessionStorage.removeItem('conAddress');
          }
        },
        error => {
          console.log(<any> error);
           this.validationForm.errorStatus(error,this.extra);
        });
  }

  addAllocatedContactClient(con){
    let allocatedCon = new AllocatedContact();
    allocatedCon.contact = con;
    allocatedCon.client = new Client();
    allocatedCon.client.id = this.client.id;
    allocatedCon.project = new Project();
    allocatedCon.project.id = this.project.id;
    this.client.allocatedContact.push(allocatedCon);
  }

  projectdata(data){
    // console.log(data);
    this.project = data;
    this.router.navigate(['/single-client-project']);
  }

  reset(f){
    f.form.reset();
  }

  edit(pro) {
    this.project = pro;
    this.router.navigate(['/edit-project']);
  }

  editProject(data){
    // console.log(data);
    window.sessionStorage.removeItem('address');
    this.extra.editTrue = true;
    this.project = data;
    this.allocatedContact = this.project.allocatedContact;
    this.allocatedInduction = this.project.allocatedInduction;
    this.project.allocatedSkillCompetency = null;
    this.project.firstTime = null
    this.contactValue = this._projectService.getIds(data.allocatedContact,'contact');
    this.inductionValue = this._projectService.getIds(data.allocatedInduction,'induction');
    this.clientValue = [this.project.client.id.toString()];
    // console.log(this.contactValue);
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }
  onUpdate (){
    this.extra.loader = true;
    this.getProjectAddress();
        // console.log(this.project);
        this._projectService.update(this.project).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else{
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                    this.project = response.data;
                    window.sessionStorage.removeItem('address');
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
  }

    initArchive(data){
        this.project = JSON.parse(JSON.stringify(data));
        // console.log(this.project);
        this.project.archived = true;
        this.extra.index = this.projects.indexOf(data);
        // console.log(this.extra.index);
    }

    archiveData(){
        this.extra.loader = true;
        this.projects.splice(this.extra.index,1);
        this._projectService.archiveProject(this.project).subscribe(
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


    findById(input, id) {
    for (var i = 0; i<input.length; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  };

  getContactname(id){
    return this._projectService.getContactname(id,this.client.allocatedContact);
  }

  /*********Advance Filter**********/

  trackProject(index, pro){
    return pro? pro.id : undefined;
  }

  toggelIcon(){
    this.extra.pro = !this.extra.pro;
  }

  filterClientChanged(data){
    this.proFilter.client = data.value;
  }

  searchFilterData(){
    if(!(this.mainProjectList.length>0)) 
        this.mainProjectList = this.projects;
    let searchData = this._projectService.formateFilterData(this.proFilter);
    // console.log(searchData);
    this.projects = this._projectService.advanceFilter(this.mainProjectList,searchData);
  }

  resetFilterData(){
    this.proFilter = new ProjectFilter();
    this.clientValue = [];
    setTimeout(()=>this.validationForm.floatLabel(),100);
    if(this.mainProjectList.length>0) {
      this.projects = this.mainProjectList;
      this.mainProjectList = [];
    }
  }

  /***********Export CSV****************/

  downLoadCSV(){
    if(this.projects){
      let formtedData = this._projectService.formatCSVData(this.projects);
      this.exportCSV.downloadCSV({ filename: "Project-Data-Table.csv", title:'Project List' }, formtedData);
    }
  }


  
}
