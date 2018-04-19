import { Component, OnInit, ElementRef } from '@angular/core';
import {Twilio} from './../../../../models/twilio';
import {Config} from './../../../../models/config';
import {ExtraData} from './../../../../models/extraData';
import { ValidationService } from './../../../../services/formValidation.service';
import {IntegrationManagement} from "../../../../services/admin/integrationManagement.service";



@Component({
  selector: 'twilio',
  templateUrl: 'twilio.component.html',
  styleUrls: ['twilio.component.css']
})
export class TwilioComponent implements OnInit {
  public twilio:Twilio;
  public configArray:Array<Config> = [];
  public extra:ExtraData;
  public twilioUpdate:boolean = false;
  
  
  constructor(
      public validationForm: ValidationService,
      public _integrationService: IntegrationManagement
    ){
    this.extra = new ExtraData();
    this.getTwilioConfig();

  }

  ngOnInit() { 
    this.initTwilio();
    window.scrollTo(0, 0);

  }
  getTwilioConfig() {
    this._integrationService.getTwilioConfig().subscribe(
        response => {
          this.configArray = response.data.configurations;
          this.twilio.twilioSID = response.data.twilioSID;
          this.twilio.twilioToken = response.data.twilioToken;
          this.twilio.twilioMobileNo = response.data.twilioMobileNo;
          this.twilio.twilioAlphaNumericId = response.data.twilioAlphaNumericId;
            this.validationForm.floatLabel();
        if(this.configArray.length > 0) {
            this.twilioUpdate = true;
            // console.log(this.twilioUpdate);
        }
          // console.log(this.configArray);
        }
    );
  }

  initTwilio(){
    this.twilio = new Twilio();
    this.validationForm.floatLabel();
  }

  onSubmit(f){

    this.configArray = this.convertConfigArray(this.twilio);
    this._integrationService.setTwilioConfig(this.configArray).subscribe(
        response => {
          // console.log(response);
          this.extra.code = response.code;
          if(response.code != 200) {
            this.extra.loaderadd = false;
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.extra.modalEl.modal('hide');
            this.extra.loaderadd = false;
            this.validationForm.successRes(response,f,this.extra);
          }
        },
        error => {
          console.log(<any> error);
          this.validationForm.errorStatus(error,this.extra);
      });
    // f.form.reset();
    // this.initTwilio();
  }

    update(f){

        this.configArray = this.convertConfigArray(this.twilio);
        this._integrationService.updateTwilioConfig(this.configArray).subscribe(
            response => {
                // console.log(response);
                this.extra.code = response.code;
                if(response.code != 200) {
                    this.extra.loaderadd = false;
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.extra.modalEl.modal('hide');
                    this.extra.loaderadd = false;
                    this.validationForm.successRes(response,f,this.extra);
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            });
        // f.form.reset();
        // this.initTwilio();
    }

  convertConfigArray(data:Twilio){
      // console.log(data);
    let arr = [];
    for(let tw in data){
      let config = new Config();
      config.category = 'Twilio';
      config.property = tw;
      config.value = data[tw];
      config.id = this.setConfigIdByProp(config.property);
      arr.push(config);
    }
    return arr;
  }

  setConfigIdByProp(property) {
      if(this.configArray.length > 0) {
          for(var i = 0; i < this.configArray.length; i++) {
              if(this.configArray[i].property == property) {
                  return this.configArray[i].id;
              }
          }
      } else {
          return 0;
      }

  }

  

  

}

