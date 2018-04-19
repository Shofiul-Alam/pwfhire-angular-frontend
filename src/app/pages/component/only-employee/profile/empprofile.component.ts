import { Component, OnInit, Input, ElementRef, ViewChild,HostListener, AfterViewInit,NgZone  } from '@angular/core';
import {EmployeeService} from './../../../../services/employee.service';
import { User } from './../../../../models/user';
import { GLOBAL } from './../../../../models/global';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Employee } from './../../../../models/employee';
import { Select2OptionData } from 'ng2-select2';
import { ValidationService } from './../../../../services/formValidation.service';
import {UserType} from "./../../../../models/UserType";
import {SkillCompetencyList} from './../../../../models/SkillCompetencyList';
import {EmployeeSkillComDoc} from './../../../../models/employeeSkillCompenetcyDoc';
import {EmployeeIdCard} from './../../../../models/employeeIdCard';
import {UploadService} from "../../../../services/upload.service";
import {EmployeeSkillDocument} from "./../../../../models/EmployeeSkillDocument";
import {EmployeeOtherDocument} from "./../../../../models/employeeOtherDoc";
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { AgmMap, AgmMarker } from '@agm/core';
import {APIServices} from "../../../../services/apiServices.service";
import {CommonService} from "../../../../services/common.service";
import {UserDeclearation} from "../../../../models/userDeclearation";
import {Induction} from "./../../../../models/Induction";
import {EmployeeInduction} from "../../../../models/employeeInduction";
import {ExtraData} from './../../../../models/extraData';
import {Pagination} from './../../../../models/pagination';
import {Location} from './../../../../models/location';
import {EmployeeDocumentService} from "../../../../services/employeeDocument.service";



@Component({
  selector: 'employee-profile',
  templateUrl: 'empprofile.component.html',
  styleUrls: ['empprofile.component.css'],
  providers: [NgbDatepickerConfig]
})
export class EmpProfileComponent implements OnInit,AfterViewInit {
    public options: Select2Options;
    public value: string[]; nationality;
    public countryList:Array<any> = [];
    public user:User;
    public search:string = '';
    currentRate = 3.5; url =GLOBAL.url;
    public employee:Employee;
    public userDeclearation:UserDeclearation;
    public skillCompetencyArray: Array<SkillCompetencyList>;
    public skillCompetency: SkillCompetencyList;
    public empDocument: EmployeeSkillComDoc;
    public empDocumentList: Array<any> = [];
    private filterDocumentList:Array<any> = [];
    public empIdCard: EmployeeIdCard;
    public formData: FormData = new FormData();
    public filesToUpload: Array<File>;
    public empUpload: any=null;
    public inductionArray: Array<Induction>=[];
    public inductionFormList:Array<Induction> = [];
    public inductionValue: string[];
    public empInductionUpload: EmployeeInduction;
    public extra:ExtraData;
    public pagi:Pagination;
    public loc:Location;
    public inductionIdArray:string[]=[];
    
  
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('address') public searchElement: ElementRef;
    @ViewChild(AgmMap) private map: any;
    @HostListener('window:resize', ['$event'])
    public onResize(event) {
      this.findLocation();
      this.apiService.redrawMap(this.map,this.loc.lat,this.loc.lng);
    }

    constructor(
        public validationForm: ValidationService,
        private _empservice: EmployeeService,
        private _empDocument:EmployeeDocumentService,
        private _uploadService: UploadService,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone,
        private _rootNode: ElementRef,
        public commonService:CommonService,
        private apiService: APIServices,
        config: NgbDatepickerConfig
    ){

        this.init();

      config.minDate = {year: 1950, month: 1, day: 1};
      config.maxDate = {year: 2099, month: 12, day: 31};
    }

    init(){
        this.userDeclearation = new UserDeclearation();
        this.employee = new Employee();
        this.employee.userDeclearation = this.employee.userDeclearation==null? this.userDeclearation:this.employee.userDeclearation;
        this.empInductionUpload = new EmployeeInduction();
        this.skillCompetency = new SkillCompetencyList();
        this.empDocument = new EmployeeSkillComDoc();
        this.empIdCard = new EmployeeIdCard();
        this.extra = new ExtraData();
        this.pagi = new Pagination();
        this.loc = new Location();
    }


  ngOnInit() {
        this.getEmployee();
        window.scrollTo(0, 0);

        let userType = new UserType(4, "employee");
        this.employee.user.userType = userType;
        // console.log(this._empservice.url);

   this.getSkillCompentency();
   this.getInductionList();
   this.value = [];

    this.options = {
         multiple: false
    };

    this.validationForm.floatLabel();
    this.getAddress();
    this.getEmployeeDcuments();
    this._uploadService.avatarUpload();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    this.removeFile();
  }

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.empUpload = null;
    });
  }

    loadPage(page: number) {
        this.pagi.page = page;
        this.getEmployeeDcuments();
    }

    getEmployee(){
      this._empservice.getUser().subscribe(
        userData => {
            // console.log(userData);
          this.employee = userData;
          this.getCountryList();
          if(this.employee.lattitude!=null || this.employee.longitude!=null){this.findLocation();}
          // console.log(userData);
            if (this.employee.dob != undefined) {
              var date = this.validationForm.convertDate(userData.dob.timestamp);
              this.employee.dob = date;
            }
          setTimeout(()=>{ this.validationForm.floatLabel()},100);
        },
        error => {
          console.log(<any> error);
        }
      );
    }

    getCountryList(){
        this._empservice.getCounrt().subscribe(
            res => { this.countryList = res;
                this.nationality = [];
                this.nationality.push(this._empservice.checkCountry(res,this.employee.nationality));
                // console.log(this.nationality,this.employee.nationality);
        });
    }

    countryChange(data:any){
        let x= this._empservice.getCountryFromSelect(this.countryList,data.value);
        this.employee.nationality = !x? this.employee.nationality:x;
            // console.log(this.employee.nationality);
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
    

    updateEmployeeData()
    {    
        this.extra.loader = true;
        // console.log(this.employee,this.empUpload);
        this._empservice.updateDataWithAvatar(this.employee,this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                   this.validationForm.getResponce(response,this.extra);
              } else {
                this.extra.editAvatar = false;
                this._empservice.changeUserData(response.data);
                this.afterUpdate(response);
                this.validationForm.getResponce(response,this.extra);
              }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );
    }

    afterUpdate(response){
        this.employee = response.data;
        let date = this.validationForm.convertDate(response.data.dob.timestamp);
        this.employee.dob = date; 
        this.employee.userDeclearation = this.employee.userDeclearation==null? this.userDeclearation:this.employee.userDeclearation;
    }

    /*********** Document*********************/

    getSkillCompentency (){
        this._empDocument.getAllSkill().subscribe(
            response => {
                this.skillCompetencyArray = response.data;
                // console.log(response);
                // console.log(this.skillCompetencyArray);
                if (response.code==200) {
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

    getInductionList(){
        this._empDocument.allInduction().subscribe(
        response => {
            this.inductionArray = response.data.map((ind)=>{
                return ind.induction;
            });
            if(response.code==200){
                for(let i of this.inductionArray){
                    i['text'] = i.name;
                }
            }
            console.log(this.inductionArray);
        },
        error => {
            console.log(<any> error);
        });
        
    }

    Inductionchanged(data: {value: string}) {
        this.empInductionUpload.induction = this.findById(this.inductionArray, data.value);

    }

    getEmployeeDcuments() {
        // console.log(this.employee);
        this._empDocument.getEmployeeDocuments(this.employee,this.pagi.page).subscribe(
            response => {
                this.empDocumentList = response.data;
                this.pagi.total_items_count = response.total_items_count;
                this.pagi.pageSize = response.items_per_page;
                this.filterDocumentList = this.empDocumentList;
                this.collectIds(this.empDocumentList);
            }
        );
    }

    newSkillCompetency() {
        this.extra.loaderadd = false;
        this.empDocument = new EmployeeSkillComDoc();
        this.extra.tsk = false;
        this.extra.pro = true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            $(".dropify-clear").trigger("click");
            this.removeFile();
        },100)
    }
    newInductiony() {
        this.extra.loaderadd = false;
        this.empInductionUpload = new EmployeeInduction();
        this.extra.tsk = false;
        this.extra.pro = true;
        this.inductionFormList = this.checkSelectedForm(this.inductionArray);
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            $(".dropify-clear").trigger("click");
            this.removeFile();
        },100)
    }
    changed(data: {value: string}) {
        this.skillCompetency = this.findById(this.skillCompetencyArray, data.value);
        // console.log(this.skillCompetency );
    }

    initSkillEdit (data){
        this.extra.loaderadd = true;
        this.extra.tsk = true;
        this.extra.pro = false;
        this.extra.imgName = data.documentPath + '/' + data.documentName;
        this.empDocument.id = data.skillCompetencyDocId;
        this.empDocument.description = data.description;
        console.log(data);
        this.value = [];
        this.value.push(data.skillId);
        setTimeout(()=>this.validationForm.floatLabel(),100);
        this.empDocument.issueDate = this.validationForm.convertToCustomDate(data.issueDate);
        this.empDocument.expiryDate = this.validationForm.convertToCustomDate(data.expiryDate);
    }

    initInductionEdit (data){
        this.extra.loaderadd = true;
        this.extra.tsk = true;
        this.extra.pro = false;
        this.extra.imgName = data.documentPath + '/' + data.documentName;
        this.empDocument.id = data.id;
        console.log(data);
        this.empInductionUpload.description = data.description
        this.inductionValue = [];
        this.inductionValue.push(data.inductionId);
        this.inductionFormList = this.inductionArray;
        setTimeout(()=>this.validationForm.floatLabel(),100);
    }

    initSkillDelete(data,i){
        this.extra.imgName = data.skillName;
        this.empDocument = data;
        this.extra.con = true;
    }

    initInductionDelete(data){
        this.extra.imgName = data.inductionName;
        this.empDocument = data;
        this.extra.con = false;
    }

    checkSelectedForm(data){
        let arr:Array<Induction> = [];
        for(let d of data){
            if(!this.inductionIdArray.includes(d.id)) arr.push(d);  
        }
        return arr;    
    }

    collectIds(data){
        for(let d of data){
            if(d.hasOwnProperty('inductionId')) this.inductionIdArray.push(d.inductionId);
        }
    }


    deleteDoc(){
        this.extra.loader = true;
        // console.log(this.empDocument);
        this._empDocument.deleteSkillDoc(this.empDocument).subscribe(
        response => {
                this.extra.code = response.code;
                if(response.code != 200) {
                   this.validationForm.getResponce(response,this.extra);
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );
    }


    addSkill(empDocument) {
        this.extra.loader = false;
        this.extra.loader = true;
        this.empDocument = empDocument;
        this.empDocument.employee = this.employee;
        this.empDocument.skillCompetencyList = this.skillCompetency;
        console.log(this.empDocument, this.empUpload);
        this._empDocument.addSkillDoc(this.empDocument, this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );

    }

    updateSkillDoc(empDocument) {
        this.extra.loader = true;
        this.empDocument.id = this.empDocument.id;
        this.empDocument.employee = this.employee;
        this.empDocument.skillCompetencyList = this.skillCompetency;
        console.log(this.empDocument);
        this._empDocument.updateEmployeeSkillDoc(this.empDocument,this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );


    }

    addInduct(f){
        this.extra.loader = true;
        this.empInductionUpload.employeeSkillDocument = this.empUpload;
        this.empInductionUpload.employee = this.employee;
        console.log( this.empInductionUpload);
        console.log(this.empUpload);

        this._empDocument.addEmployeeInductionDoc(this.empInductionUpload, this.empUpload).subscribe(
            response=> {
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );
    }


    updateInduct(f){
        // console.log(f);
        this.extra.loader = true;
        this.empInductionUpload.id = this.empDocument.id;
        if(this.empUpload!=undefined) this.empInductionUpload.employeeSkillDocument = this.empUpload;
        this.empInductionUpload.employee = this.employee;
        console.log( this.empInductionUpload);
        // console.log(this.empUpload);
        this._empDocument.updateEmployeeInductionDoc(this.empInductionUpload,this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.getEmployeeDcuments();
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );
    }


    resetForm (f){
        f.form.reset();
        this.extra.editAvatar = false;
        this.empUpload =null;
        $(".dropify-clear").trigger("click");
    }

    findById(input, id) {
        if(input){  
            for (var i = 0; i<input.length; i++) {
                if (input[i].id == id) {
                    return input[i];
                }
            }
        }
        return null;
    };

    validAddbutton(){
        if(this.empUpload==null) return true;
        return false;
    }



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
            },
            (error) => {
                console.log(error);
            });
    }
    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    changeDoc(){
        this.extra.pro= true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            this.removeFile();
        },100)
    }
    cancleChange(){
         this.extra.pro= false;
         $(".dropify-clear").trigger("click");
         this.empUpload =null;
    }

    editAvatarClick(){
        this.extra.editAvatar = true;
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            this.removeFile();
        },100)
    }
    cancelAvatarClick(){
         this.extra.editAvatar = false;
         $(".dropify-clear").trigger("click");
         this.empUpload =null;
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

    checkExpiry(data){
       return this.validationForm.checkExpiryDate(data);
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

    searchDocument(f:string){
        this.empDocumentList = this._empDocument.searchDoc(f,this.filterDocumentList);
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


