import { Component, OnInit, Input, ElementRef, ViewChild,HostListener, AfterViewInit,NgZone  } from '@angular/core';
import {EmployeeManagementService} from './../../../../services/admin/employeeManagement.service';
import { User } from './../../../../models/user';
import {NgbDatepickerConfig,NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { Employee } from './../../../../models/employee';
import { Select2OptionData } from 'ng2-select2';
import { ValidationService } from './../../../../services/formValidation.service';
import {UserType} from "./../../../../models/UserType";
import {SkillCompetencyList} from './../../../../models/SkillCompetencyList';
import {EmployeeSkillComDoc} from './../../../../models/employeeSkillCompenetcyDoc';
import {EmployeeIdCard} from './../../../../models/employeeIdCard';
import { SkillCompetencyManagement } from './../../../../services/admin/adminSkillCompetency.service';
import {Router} from '@angular/router';
import {UploadService} from "./../../../../services/upload.service";
import {EmployeeSkillDocument} from "./../../../../models/EmployeeSkillDocument";
import {Induction} from "./../../../../models/Induction";
import { ImagePopUpService } from './../../../../services/imagePopUp.service';
import { AgmMap, AgmMarker } from '@agm/core';
import { CommonService } from './../../../../services/common.service';
import {UserDeclearation} from "../../../../models/userDeclearation";
import {APIServices} from "../../../../services/apiServices.service";
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {InductionService} from "../../../../services/admin/adminInduction.service";
import {EmployeeInduction} from "../../../../models/employeeInduction";
import {ExtraData} from "./../../../../models/extraData";
import {Pagination} from "./../../../../models/pagination";
import {Location} from "./../../../../models/location";
import {Form} from "./../../../../models/Form";
import { FormService } from './../../../../services/admin/adminForm.service';
import {InductionPermission} from "./../../../../models/inductionPermission";
import {PermissionManagement} from "../../../../services/admin/permissionManagement.service";
import { ExportCSV } from './../../../../services/exportCSV.service';



@Component({
    selector: 'employee-editForm',
    templateUrl: 'editemployee.component.html',
    styleUrls: ['editemployee.component.css'],
    providers: [NgbDatepickerConfig]
})
export class EditEmployeeComponent implements OnInit,AfterViewInit  {
    public options: Select2Options;
    public value: string[]; nationality;
    public search:string = '';
    public user:User; 
    public Empinduction;
    public docImage:string='';
    public checkPass: string;
    skill:boolean = true;
    change:boolean= false; 
    public skillCompetencyArray: Array<SkillCompetencyList>;
    public skillCompetency: SkillCompetencyList;
    public empDocument: EmployeeSkillComDoc;
    public empDocumentList: Array<any> =[];
    public filterDocumentList: Array<any>;
    public filesToUpload: Array<File>;
    public empUpload: any=null;
    public inductionArray: Array<Induction>;
    public inductionValue: string[];
    public countryList = [];
    public currentRate = 3.5;
    public userDeclearation:UserDeclearation;
    public empInductionUpload: EmployeeInduction;
    public extra:ExtraData;
    public pagination:Pagination;
    public loc:Location;
    public formArray: Array<Form>= [];
    public inductionFormList:Array<Form|Induction> = [];
    public sendingForm;
    public employeeInductionList:Array<InductionPermission> = []; 
    public filterEmpInductionList:Array<InductionPermission> = []; 
    formIdArray:string[]=[]; inductionIdArray:string[]=[];
    public inductionPermission:InductionPermission;
    


    public get employee():Employee {
        return this._empservice.employee;
    }
    public set employee(value: Employee) {
        this._empservice.employee = value;

    }

    @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('address') public searchElement: ElementRef;

    @ViewChild(AgmMap) private map: any;
    @HostListener('window:resize', ['$event'])
    public onResize(event) {
      this.redrawMap();
    }

    redrawMap() {
       this.map.triggerResize()
      .then(() => this.map._mapsWrapper.setCenter({lat: this.loc.lat, lng: this.loc.lng}));
    }

    constructor(
        public validationForm: ValidationService,
        private _empservice: EmployeeManagementService,
        private _skillcompetencyService: SkillCompetencyManagement,
        private router: Router,
        private _uploadService: UploadService,
        public imagePopUp: ImagePopUpService,
        config: NgbDatepickerConfig,
        private _rootNode: ElementRef,
        configRatting: NgbRatingConfig,
        public  commonService: CommonService,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone,
        private _inductionService: InductionService,
        private apiService: APIServices,
        private _formService:FormService,
        private _export: ExportCSV,
        private _permissioinService: PermissionManagement
    ){
        if(this.employee.id===0) {
            this.router.navigate(['/employees']);
            // console.log(this.employee);
        } 
         this.init();
         config.minDate = {year: 1950, month: 1, day: 1};
         config.maxDate = {year: 2099, month: 12, day: 31};
         configRatting.max = 5;
         configRatting.readonly = true;
    }

    init(){
        this.userDeclearation = new UserDeclearation();
        this.empInductionUpload = new EmployeeInduction();
        this.skillCompetency = new SkillCompetencyList();
        this.empDocument = new EmployeeSkillComDoc();
        this.checkPass = '';
        this.loc = new Location();
        this.extra = new ExtraData();
        this.pagination = new Pagination();
        this.inductionPermission = new InductionPermission();
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        if(this.employee.id !==0){
            this.getCountryList();
            let userType = new UserType(4, "employee");
            this.employee.user.userType = userType;
            this.employee.userDeclearation = this.employee.userDeclearation==null? this.userDeclearation:this.employee.userDeclearation;
            this.listData();
            this.getAddress();
            this.getInductionList();
            if(this.employee.lattitude!=null || this.employee.longitude!=null){this.findLocation();}
            this.options = {
                multiple: false
            };
            // console.log(this.employee);
            this.validationForm.floatLabel();
            this.getEmployeeDcuments();
            this._uploadService.avatarUpload();
            this.getForm();
        }
    }

    ngAfterViewInit() {
        this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
        setTimeout(()=>this.removeFile(),100);
    }

    removeFile(){
        let file:any =  $(this._rootNode.nativeElement).find('.dropify');
        let a =file.dropify();
        a.on('dropify.afterClear', ()=>{
            this.empUpload = null;
        });
      }

    loadPage(page: number) {
        this.pagination.page = page;
        this.getEmployeeDcuments();
      }

    getCountryList(){
        this._empservice.getCounrt().subscribe(
            res => { this.countryList = res;
                   this.nationality=this._empservice.checkCountry(this.countryList,this.employee.nationality);
            
        });
    }

    countryChange(data:any){
        setTimeout(()=>{
            this.employee.nationality= this._empservice.getCountryFromSelect(this.countryList,data.value);
            // console.log(this.employee.nationality);
        },100);
    }
    
   

    getAddress(){
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });
                autocomplete.addListener("place_changed", () => {
                  this.ngZone.run(() => { 
                   let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                       // console.log(place);
                      this.getEmpAddress(place.formatted_address,place.geometry.location.lat(),place.geometry.location.lng());
                });
            });
        });
    }

    getEmpAddress(address,lat,lng){
       this.employee.address = address;
       this.employee.lattitude = lat;
       this.employee.longitude = lng;
       this.findLocation();
    }

    findLocation(){
        this.loc.lat = this.employee.lattitude;
        this.loc.lng  = this.employee.longitude;
        this.apiService.redrawMap(this.map,this.loc.lat,this.loc.lng);
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

    Inductionchanged(data: {value: string}) {
        this.Empinduction = this.findById(this.inductionArray, data.value);

    }

    getEmployeeDcuments() {
        // console.log(this.employee);
        this._empservice.getEmployeeDocuments(this.employee,this.pagination.page).subscribe(
            response => {
                this.empDocumentList = response.data;
                this.pagination.total_items_count = response.total_items_count;
                this.pagination.pageSize = response.items_per_page;
                this.filterDocumentList = this.empDocumentList;
            }
        );
    }

    newSkillCompetency() {
        this.empUpload=null;
        this.empDocument = new EmployeeSkillComDoc();
        this.change = true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            $(".dropify-clear").trigger("click");
            this.removeFile();
        },100);
    }
    newInductiony() {
        this.empUpload=null;
        this.empInductionUpload = new EmployeeInduction();
        this.change = true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            $(".dropify-clear").trigger("click");
            this.removeFile();
        },100);
    }
    changed(data: {value: string}) {
        this.skillCompetency = this.findById(this.skillCompetencyArray, data.value);
        // console.log(this.skillCompetency );
    }

    initSkillEdit (data){
        this.empUpload=null;
        this.extra.editAvatar = true;
        this.change = false;
        this.docImage = data.documentPath + '/' + data.documentName;
        this.empDocument.id = data.skillCompetencyDocId;
        this.empDocument.description = data.description;
        // console.log(data);
        this.value = [];
        this.value.push(data.skillId);
        setTimeout(()=>this.validationForm.floatLabel(),100);
        this.empDocument.issueDate = this.validationForm.convertToCustomDate(data.issueDate);
        this.empDocument.expiryDate = this.validationForm.convertToCustomDate(data.expiryDate);
    }

    initInductionEdit (data){
        this.empUpload=null;
        this.extra.editAvatar = true;
        this.change = false;
        this.docImage = data.documentPath + '/' + data.documentName;
        this.empDocument.id = data.id;
        // console.log(data);
        this.empInductionUpload.description = data.description
        this.inductionValue = [];
        this.inductionValue.push(data.inductionId);
        setTimeout(()=>this.validationForm.floatLabel(),100);
    }

    initSkillDelete(data){
        this.docImage = data.skillName;
        this.deleteSkillIndu(data);
        this.skill = true;
    }

    initInductionDelete(data){
        this.docImage = data.inductionName;
        this.deleteSkillIndu(data);
        this.skill = false;
    }

    deleteSkillIndu(data){
        this.empDocument = data;
        this.extra.index = this.empDocumentList.indexOf(data);
        // console.log(this.extra.index);
    }

    deleteDoc(){
        this.extra.loader = true;
        // console.log(this.empDocument);
        this._empservice.deleteSkillDoc(this.empDocument).subscribe(
        response => {
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.empDocumentList.splice(this.extra.index,1);
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                    this.empDocument = new EmployeeSkillComDoc();
                }

            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
    }


    addSkill(empDocument) {
        this.extra.loader = false;
        this.extra.loader = true;
        this.empDocument = empDocument;
        this.empDocument.employee = this.employee;
        this.empDocument.skillCompetencyList = this.skillCompetency;

        this._skillcompetencyService.addSkillDoc(this.empDocument, this.empUpload).subscribe(
            response => {
                // console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.validationForm.getResponce(response,this.extra);
                    // this.empDocumentList.push(response.document);
                    this.getEmployeeDcuments();
                    this.extra.modalEl.modal('hide');
                    this.empDocument = new EmployeeSkillComDoc(); 
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );

    }

    updateSkillDoc(empDocument) {
        this.extra.loader = false;
        this.extra.loader = true;
        // console.log(empDocument);
        this.empDocument.employee = this.employee;
        this.empDocument.skillCompetencyList = this.skillCompetency;
        // console.log(this.empDocument);
        this._empservice.updateEmployeeDoc(this.empDocument,this.empUpload).subscribe(
            response => {
                // console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                 this.validationForm.getResponce(response,this.extra);   
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                    this.cancleChange();
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );


    }

    addInduct(f){
        this.extra.loader = false;
        this.extra.loader = true;
        this.empInductionUpload.employeeSkillDocument = this.empUpload;
        // this.empInductionUpload.employeeSkillDocument = null;
        this.empInductionUpload.employee = this.employee;
        this.empInductionUpload.induction = this.Empinduction;
        // console.log( this.empInductionUpload);
        // console.log(this.empUpload);

        this._inductionService.addEmployeeInductionDoc(this.empInductionUpload, this.empUpload).subscribe(
            response=> {
                // console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    // this.empDocumentList.push(response.document);
                    this.getEmployeeDcuments();
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


    updateInduct(f){
        this.extra.loader = false;
        this.extra.loader = true;
        this.empInductionUpload.induction = this.Empinduction;
        this.empInductionUpload.id = this.empDocument.id;
        // if(this.empUpload!=undefined) this.empInductionUpload.employeeSkillDocument = this.empUpload;
        this.empInductionUpload.employeeSkillDocument = null;
        this.empInductionUpload.employee = this.employee;
        // console.log( this.empInductionUpload);
        // console.log(this.empUpload);
        this._empservice.updateEmployeeDoc(this.empInductionUpload,this.empUpload).subscribe(
            response => {
                // console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                   
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide'); 
                    this.cancleChange();
                }
            },
            error => {
                console.log(<any> error);
            }
        );
        
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

    onUpdate()
    {   
        // console.log(this.employee,this.empUpload);
        this.extra.loader = true;
        this._empservice.updateDataWithAvatar(this.employee,this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
              // console.log(response);
              if(response.code != 200) {
                this.validationForm.getResponce(response,this.extra);
              } else {
                this.employee = response.data;
                this.employee.dob = this.validationForm.convertToCustomDate(this.employee.dob);
                this.validationForm.getResponce(response,this.extra);
                this.cancelAvatarClick();
              }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );


    }

    changeDoc(){
        this.change= true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            this.removeFile();
        },100);
    }
    cancleChange(){
         this.change= false;
         $(".dropify-clear").trigger("click");
         this.empUpload =null;
    }


    resetForm (f){
        f.form.reset();
        this.extra.editAvatar = false;
        setTimeout(()=>this._uploadService.avatarUpload(),100);
    }

    findById(input, id) {

        for (var i = 0; i<input.length; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    };



    fileChangeEvent(fileInput:any, b:any){
        this.extra.fileLoad = true;
        this.filesToUpload = <Array<File>>fileInput.target.files;
        let bar = b;
        let token;
        let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
        this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload,bar).then(
            (result) => {
                this.extra.fileLoad = false;
                this.empUpload = result['upload'];
                this.filesToUpload = [];
            },
            (error) => {
                // console.log(error);
            });
    }


    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    editAvatarClick(){
        this.extra.editAvatar = true;
         setTimeout(()=>{
            this._uploadService.avatarUpload();
            this.removeFile();
        },100);
    }
    cancelAvatarClick(){
         this.extra.editAvatar = false;
         $(".dropify-clear").trigger("click");
         this.empUpload =null;
    }

    workWithUs(date){
        if(date!=null || date!= undefined){
            let a = new Date(date.timestamp * 1000);
            let b = new Date();
            var timeDiff = Math.abs(b.getTime() - a.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));  
            return diffDays;
            
        }
        return;
    }

    checkPdf(a){
        let x;
        if(a){
            if(a.indexOf("/")==-1) x = this.validationForm.picIcon(a);
            else {
                let n = a.indexOf("/");
                x = this.validationForm.picIcon(a.slice(n+1));
            }
            if(x=='pdf') return 1;
            return 0;
        }
    }

    validAddbutton(){
        if(this.empUpload==null) return true;
        return false;
    }

    //******************  form/Induction tab **********************

    getForm(){
        this._formService.getForm().subscribe(
          response => {
            this.formArray = response.data;
            for(let i of this.formArray){
              i['text'] = i.formName;
            }
            // console.log(this.formArray);
          },
          error => {
            console.log(<any> error);
          });
    }

    loadInductionPage(page){
         this.pagination.page = page;
         this.getEmployeeInductionForm();
    }    

    getEmployeeInductionForm(){
        this.search = '';
        this.pagination = new Pagination();
        this._permissioinService.getEmployeeInductionForms(this.employee.id,this.pagination.page).subscribe(
            res => {
                // console.log(res);
                this.employeeInductionList = res.data;
                this.collectIds(this.employeeInductionList);
                this.filterEmpInductionList = this.employeeInductionList;
            }, err => console.log(err)
        );
    }

    initAddForm(){
        this.extra.con = false;
        this.inductionFormList = this.checkSelectedForm(this.formArray,true);
    }

    initAddInduction(){
        this.extra.con = true;
        this.inductionFormList = this.checkSelectedForm(this.inductionArray,false);
    }

    inductionFormChanged(data: {value: string[]}){
        this.sendingForm = this.findById(this.inductionFormList, data.value);
        // console.log(this.sendingForm);
    }

    addEmployeInductionForm(){

        this.extra.loader = true;

        this.inductionPermission.employee = this.employee;
        this.inductionPermission.induction = this.sendingForm;

        this._permissioinService.permitInduction(this.inductionPermission).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else{
                    this.validationForm.getResponce(response,this.extra);
                    this.employeeInductionList.splice(0,0,response.data);
                    this.collectIds(this.employeeInductionList);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );

    }

    checkSelectedForm(data,form:boolean){
        let arr:Array<Form|Induction> = [];
        if(form){
            for(let d of data){
                if(!this.formIdArray.includes(d.id)) arr.push(d);
            }    
        } else {
            for(let d of data){
                if(!this.inductionIdArray.includes(d.id)) arr.push(d);
            }   
        }
        return arr;    
    }

    collectIds(data){
        for(let d of data){
            if(d.hasOwnProperty('form')) this.formIdArray.push(d.form.id);
            if(d.hasOwnProperty('induction')) this.inductionIdArray.push(d.induction.id);
        }
    }

    initArchive(data,index){
        this.inductionPermission = data;
        this.extra.index = index;
    }

    archiveData(){
        this.employeeInductionList.splice(this.extra.index,1);
    }

    /********** Search***************/

    clearSearch(){
        this.pagination = new Pagination();
        this.search = '';
    }

    checkExpiry(data){
       return this.validationForm.checkExpiryDate(data);
    }

    trackDoc(index,doc){
        return doc? doc.documentId : undefined;
    }

    searchDocument(f:string){
        this.empDocumentList = this._empservice.searchDoc(f,this.filterDocumentList);
    }

    initExpiring(){
        this.extra.loaderadd = false;
    }

    initExpired(){
        this.extra.loaderadd = true;
    }

    getExpiringDocList(){
        return this.validationForm.expiringDocList(this.empDocumentList,this.extra.loaderadd);
    }

    searchInduction(f:string){
        this.employeeInductionList = this._empservice.searchInduction(f,this.filterEmpInductionList);
    }

    trackInduction(index,induc){
        return induc? induc.id : undefined;
    }

    /****************CSV*************/

    downloadDocCSV(){
        let doc = this._empservice.formatDocCSV(this.empDocumentList);
        this._export.downloadCSV({ filename: this.employee.user.firstName+"-Doc-Table.csv", 
                                    title: this.employee.user.firstName+' Doc List' }, doc);
    }

    downloadApprovedIndCSV(){
        let ind = this._empservice.formatInductionCSV(this.employeeInductionList);
        this._export.downloadCSV({ filename: this.employee.user.firstName+"-Induction-Allowed-Table.csv", 
                                    title: this.employee.user.firstName+' Induction Allowed List' }, ind);
    }



}


