import { Component, OnInit, Input, ElementRef, ViewChild,HostListener, AfterViewInit,NgZone  } from '@angular/core';
import {AdminService} from './../../../../services/admin/admin.service';
import { Admin } from './../../../../models/admin';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { Select2OptionData } from 'ng2-select2';
import { ValidationService } from './../../../../services/formValidation.service';
import {UserType} from './../../../../models/UserType';
import {UserService} from './../../../../services/user.service';
import {Router} from '@angular/router';
import {UploadService} from "../../../../services/upload.service";
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { AgmMap, AgmMarker } from '@agm/core';
import {APIServices} from "../../../../services/apiServices.service";
import {ExtraData} from "./../../../../models/extraData";
import {Location} from "./../../../../models/location";





@Component({
  selector: 'admin-profile',
  templateUrl: 'adminProfile.component.html',
  styleUrls: ['adminProfile.component.css'],
  providers: [NgbDatepickerConfig]
})
export class AdminProfileComponent implements OnInit, AfterViewInit {
    public options: Select2Options;
    public value: string[];
    public admin:Admin;
    public UserType:UserType;
    public filesToUpload: Array<File>;
    public empUpload: any;
    public extra:ExtraData;
    public loc:Location;
    public checkPass:string = '';
    public updatePass:string = '';
    public updateEmail;

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('address') public searchElement: ElementRef;
    @ViewChild(AgmMap) private map: any;
    @HostListener('window:resize', ['$event'])
    public onResize(event) {
      this.apiService.redrawMap(this.map,this.loc.lat,this.loc.lng);
    }
 


    constructor(
        public validationForm: ValidationService,
        private _userService: AdminService,
        private _uploadService: UploadService,
        private mapsAPILoader: MapsAPILoader, 
        private ngZone: NgZone,
        private _rootNode: ElementRef,
        private apiService: APIServices,
        config: NgbDatepickerConfig
    ){

    config.minDate = {year: 1950, month: 1, day: 1};
    config.maxDate = {year: 2050, month: 12, day: 31};
    this.init();
  }

  init(){
    this.admin = new Admin();
    var userType = new UserType(0, "admin");
    this.admin = new Admin();
    this.admin.user.userType = userType;
    this.extra = new ExtraData();
    this.loc = new Location();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.validationForm.floatLabel();
    this.getUserInformation();
      

    this.value = [];

    this.options = {
        multiple: false
    };

    this.getAddress();
  }
  
  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    setTimeout(()=>this.removeFile(),100);
  }

  getAddress(){
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:["address"] });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => { 
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              // console.log(place);
              this.admin.address = place.formatted_address;  
              this.findLocation();      
            });
        });
    });
  }

  findLocation(){
    let x;
    this.apiService.getLocation(this.admin.address)
        .then((response) => {
          x = response.results[0].geometry.location; 
          // console.log(x);
          this.loc.lat = x.lat;
          this.loc.lng  = x.lng;
          this.apiService.redrawMap(this.map,this.loc.lat,this.loc.lng);
        })
        .catch((error) => console.error(error));
  }

  getUserInformation(){
    this._userService.getUser().subscribe(
        userData => {

          this.admin = userData;
          // console.log(userData);
            var date = this.validationForm.convertToCustomDate(userData.dob);
            var invDate = this.validationForm.convertToCustomDate(this.admin.invoiceDueDate);
            this.admin.dob = date;
            this.admin.invoiceDueDate = invDate;
            setTimeout(()=>{ this.validationForm.floatLabel();},100);
        },
        error => {
          console.log(<any> error);
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


    updatedata()
    {   this.extra.loader = true;
        // console.log(this.admin,this.empUpload);
        this._userService.updateDataWithAvatar(this.admin,this.empUpload).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                  this.validationForm.getResponce(response,this.extra);
              } else {
                this._userService.changeUserData(response.data);
                this.admin = response.data;
                this.extra.editAvatar = false;
                this.admin.dob =!response.data.dob? null:this.validationForm.convertToCustomDate(response.data.dob);
                this.admin.invoiceDueDate = !response.data.invoiceDueDate? null:this.validationForm.convertToCustomDate(response.data.invoiceDueDate);
                this.validationForm.getResponce(response, this.extra);
              }
            },
            error => {
                console.log(<any> error);
                this.extra.loader = false;
            }
        );
    }


    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        let token;
        let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
        this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload).then(
            (result) => {
                this.empUpload = result['upload'];
            },
            (error) => {
                console.log(error);
            });
    }
    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    editAvatarClick(){
        this.extra.editAvatar = true;
        setTimeout(()=>this._uploadService.avatarUpload(),100)
    }
    cancelAvatarClick(){
         this.extra.editAvatar = false;
         this.empUpload = null;
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

    updateProfilePassword(){
        this.extra.loader = true;

        this._userService.updatePassowrd(this.updatePass).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {

                    this.admin.user = response.data;
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

    resetEmail(){
        this.extra.loader = true;

        this._userService.updateEmail(this.updateEmail).subscribe(
            response => {
                this.extra.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {

                    this.admin.user = response.data;
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

    /***************Upload Doc****************/

    removeFile(){
        let file:any =  $(this._rootNode.nativeElement).find('.dropify');
        let a =file.dropify();
        a.on('dropify.afterClear', ()=>{
            this.empUpload = null;
        });
      }

    initUploadDoc(){
        setTimeout(()=>{
            this._uploadService.avatarUpload();
            $(".dropify-clear").trigger("click");
            this.removeFile();
        },100);
    }



}


