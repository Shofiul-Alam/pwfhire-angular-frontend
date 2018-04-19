import { Component, OnInit,ViewChild,ElementRef, AfterViewInit} from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { Project } from './../../../../models/project';
import { User } from './../../../../models/user';
import { Contact } from './../../../../models/contact';
import { UserType } from './../../../../models/UserType';
import { ValidationService } from './../../../../services/formValidation.service';
import { ContactManagment } from './../../../../services/admin/contactManagement.service';
import {Client} from './../../../../models/client';
import { ClientManagment } from './../../../../services/admin/clientManagement.service';
import {ProjectManagement} from "../../../../services/admin/projectManagement.service";
import {Router} from '@angular/router';
import { CommonService } from './../../../../services/common.service';
import {AllocatedContact} from "../../../../models/allocatedContact";
import {APIServices} from "../../../../services/apiServices.service";
import {Observable} from 'rxjs/Rx';
import {InductionService} from "../../../../services/admin/adminInduction.service";
import {Induction} from "./../../../../models/Induction";
import {ExtraData} from "./../../../../models/extraData";
import {Pagination} from "./../../../../models/pagination";
import {AllocatedInduction} from "../../../../models/allocatedInduction";
import {ProjectFilter} from "./../../../../models/projectFilter";
import { ExportCSV } from './../../../../services/exportCSV.service';



@Component({
  selector: 'project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class AllProjectComponent implements OnInit {
  public contactValue: string[];
  public options: Select2Options;
  public contactList: Array<Contact> = [];
  public inductionArray: Array<Induction>;
  public inductionValue: string[];
  public allocatedContact: Array<AllocatedContact> = [];
  public allocatedInduction: Array<AllocatedInduction> = [];
  public user: User;
  public userType: UserType;
  public contact: Contact;
  public singleOptins:Select2Options;
  public client: Client;
  public clientArray: Array<Client>= [];
  public clientValue:string[];
  public clientContact:AllocatedContact;
  public pagination:Pagination;
  public extra:ExtraData;
  public projects:Array<Project>;
  public mainProjectList:Array<Project> = [];
  public induction:Induction;
  public proFilter:ProjectFilter;

  public get project():Project {
    return this._projectService.project;
  }
  public set project(value: Project) {
    this._projectService.project = value;
  }


  @ViewChild('contactAddress') public contactAddressElm: ElementRef;
  @ViewChild('projectAddress') public projectAddressElm: ElementRef;


  constructor(
      public validationForm: ValidationService,
      private _contactService: ContactManagment,
      private _clientService: ClientManagment,
      private _projectService: ProjectManagement,
      private router: Router,
      private _rootNode: ElementRef,
      private apiService: APIServices,
      private _inductionService: InductionService,
      public  commonService: CommonService,
      private exportCSV:ExportCSV
    )
  {
      this.init();
  }

  init(){
    this.project = new Project();
    this.userType = new UserType(5,'client');
    this.user = new User (0,"","","","","");
    this.contact = new Contact();
    this.contact.user.userType = this.userType;
    this.contactDetailsInit();
    this.extra = new ExtraData();
    this.pagination = new Pagination();
    this.induction = new Induction();
    this.proFilter = new ProjectFilter();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.options = {
      multiple: true
    }
    this.singleOptins = {
          multiple: false
      }
    this.getAllProject();
    this.getAddress();
    this.clientList();
    this.getInductionList();
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#addProject');
  }

  getAddress(){
        this.apiService.contactAddress(this.contactAddressElm.nativeElement);
        this.apiService.addressAutoComplete(this.projectAddressElm.nativeElement);
    }

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page);
    this.getAllProject();
  }

  getAllProject() {
    this._projectService.allProject(this.pagination.page).subscribe(
        response=> {
            // console.log(response);
            this.projects = response.data;
            this.pagination.total_items_count = response.total_items_count;
            this.pagination.pageSize = response.items_per_page;
            // console.log(response.data[0]);
        }
    )
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

  edit(pro) {
    this.project = pro;
    this.router.navigate(['/edit-project']);
  }

  contactDetailsInit(){
      this.clientContact = new AllocatedContact();
      this.clientContact.contact = this.contact;
      this.clientContact.project = this.project;
  }


  clientList() {
    // console.log(this.clientArray.length);
    this._clientService.allClientList().subscribe(
      response => {
        if(response.code == 200) this.clientArray = this._projectService.addText(response.data,'companyName');
      },
      error => console.log(<any> error)
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
    this.contactValue = this._projectService.getIds(this.project.allocatedContact,'contact');
  }

  addContactToAllocation(data: {value: string[]}) {
    this.project.allocatedContact = this._projectService.addAllocatedContact(data.value,this.allocatedContact,'contact');
    // console.log(this.project.allocatedContact);
  }

  initAddProject(){
    this.extra.editTrue = false;
    window.sessionStorage.removeItem('address');
    this.project = new Project();
    this.clientValue = [this.clientArray[0].id.toString()];
    this.contactValue = [];
    this.inductionValue = [];
    this.allocatedContact = this.project.allocatedContact;
    this.allocatedInduction = this.project.allocatedInduction;
    // console.log(this.project);
    setTimeout(()=>{this.validationForm.floatLabel()},100);
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
    this.getProjectAddress();
    // console.log(this.project);
    this.extra.loader = true;
    this._projectService.add(this.project).subscribe(
      response => {
        this.extra.code = response.code;
        // console.log(response);
        if(response.code != 200) {
          this.validationForm.getResponce(response,this.extra);
        } else{
          this.projects.push(response.Project);
          this.pagination.total_items_count = this.pagination.total_items_count + 1;
          this.validationForm.successRes(response,f,this.extra);
          this.extra.modalEl.modal('hide');
          this.initAddProject();
        }
      },
      error => {
        console.log(<any> error);
        this.validationForm.errorStatus(error,this.extra);
      }
    );
  }

  colorContact(i){
    return this._contactService.colorContact(i);
  }

  initInductionDetails(f){
    // console.log(f);
    if(f.induction.name==''){
        this.induction = this._projectService.findProperDetails(f,this.inductionArray); 
    } else this.induction = f.induction;
    // this.clientContact = f;
  }

  findProperDetails(f){
    return this._projectService.findProperDetails(f,this.inductionArray);
  }

  initContactDetails(f){
    // console.log(f);
    if(!f.hasOwnProperty('origId')|| f.id==0){
       for(let x of this.client.allocatedContact){
        if(f.contact.id==x.contact.id){
          this.clientContact = x;
        }
      }
    } else this.clientContact = f;
  }

  getContactname(id){
    return this._projectService.getContactname(id,this.client.allocatedContact);
  }


  /* **************Edit ********************* */


  editProject(data){
    window.sessionStorage.removeItem('address');
    this.extra.editTrue = true;
    this.project = data;
    this.project.allocatedSkillCompetency = null;
    this.project.firstTime = null;
    this.allocatedInduction = this.project.allocatedInduction;
    this.allocatedContact = this.project.allocatedContact;
    this.contactValue = this._projectService.getIds(data.allocatedContact,'contact');
    this.inductionValue = this._projectService.getIds(data.allocatedInduction,'induction');
    this.clientValue = [this.project.client.id.toString()];
    console.log(this.project);
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }

  onUpdate (){
    this.getProjectAddress();
    // console.log(this.project);
    this.extra.loader = true;
    this._projectService.update(this.project).subscribe(
      response => {
        this.extra.code = response.code;
        // console.log(response);
        if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
        } else{
            this.validationForm.getResponce(response,this.extra);
            this.extra.modalEl.modal('hide');
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



  initContact() {
    window.sessionStorage.removeItem('conAddress');
    this.extra.modalEl.modal('hide');
    let userC = new User();
    let userT = new UserType(0, 'contact');
    userC.userType = userT;
    this.contact.user = userC;
  }

  addContact(f){
    this.extra.loader = true;
    this.contact.id = '0';
    this.contact.address = sessionStorage.getItem('conAddress');
    this._contactService.add(this.contact, this.client).subscribe(
        response => {
          // console.log(response);
          this.extra.code = response.code;
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.client.allocatedContact.push(this._projectService.addAllocatedContactClient(response.Contact));
            this.project.client.allocatedContact = this.client.allocatedContact;
            this.validationForm.successRes(response,f,this.extra);
            this.extra.modalEl.modal('hide');
            window.sessionStorage.removeItem('conAddress');
            this.intContactList();
            this.extra.modalElOpen.modal('show');
          }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
        });
  }

  
  resetContact(f){
    f.form.reset();
    this.validationForm.floatLabel();
    this.extra.modalElOpen.modal('show');
  }

  /*********Advance Filter**********/

  toggelIcon(){
    this.extra.pro = !this.extra.pro;
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
