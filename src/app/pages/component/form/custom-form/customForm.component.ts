import { Component, OnInit } from '@angular/core';
import { config, defaultI18n, defaultOptions } from "./../formbuilder/config";
import { FormBuilderCreateor } from "./../formbuilder/form-builder";
import I18N from "./../formbuilder/mi18n";
import {Router} from '@angular/router';
import { FormService } from './../../../../services/admin/adminForm.service';

import { Form } from './../../../../models/Form';
import {EditFormModel} from './../../../../models/formEditModel';


function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (options) {
      if (!options) {
        options = {};
      }
      let elems = this;
      let {i18n, ...opts} = $.extend({}, defaultOptions, options, true);
      (<any>config).opts = opts;
      let i18nOpts = $.extend({}, defaultI18n, i18n, true);
      let instance = {
        actions: {
          getData: null,
          setData: null,
          save: null,
          showData: null,
          setLang: null,
          addField: null,
          removeField: null,
          clearFields: null
        },
        get formData() {
          return instance.actions.getData('json');
        },

        promise: new Promise(function (resolve, reject) {
          new I18N().init(i18nOpts).then(() => {
            elems.each(i => {
              let formBuilder = new FormBuilderCreateor().getFormBuilder(opts, elems[i]);
              $(elems[i]).data('formBuilder', formBuilder);
              instance.actions = formBuilder.actions;
            });
            delete instance.promise;
            resolve(instance);
          }).catch(console.error);
        })

      };

      return instance;
    };
  })(jQuery);
}



@Component({
  selector: 'custom-form',
  templateUrl: './customForm.component.html',
  styleUrls: ['./customForm.component.css']
})

export class CustomFormComponent implements OnInit {
  formBuilder: any;
  edit:boolean = false;
  form:Form;
  
  private token; private fieldsArr:Array<any> = [];

  public get editFormModel() {
    return this._formService.editFormModel;
  }
  public set editFormModel(value) {
    this._formService.editFormModel = value;
  }



  constructor(
    private _formService:FormService,
    private router: Router
  ){
    this.form = new Form();
  }
  
  ngOnInit(): void {
    initJq();
    let options = {
      editOnAdd: true,
      showActionButtons: false,
      fieldRemoveWarn: true
    };
    this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder(options);
    
    if(this.editFormModel.formData!= null){
      this.editInit(this.editFormModel.formData);
    } 

  }

  

  ngOnDestroy(){
    this.editFormModel.formData= null;
  }

  clearData(){
    this.formBuilder.actions.clearFields();
  }
  showData(){
    this.formBuilder.actions.showData();
  }
  saveData(){
    let formData: any = {};
       let trimData = this._formService.trimLabel(this.formBuilder.actions.getData());
        formData = this._formService.createFormName(trimData);
        for(var i = 0; i < formData.formData.length; i++) {
          if(typeof formData.formData[i].values != 'undefined' || formData.formData[i].values != null) {
            formData.formData[i].valueArr = formData.formData[i].values;
            formData.formData[i].values = null;
          }
        }  

    // console.log(formData); 
    this._formService.addForm(formData).subscribe(
      response => {
        // console.log(response);
        this.clearData();
        this.router.navigate(['/form-list']);
      },
      error => {
        console.log(<any> error);
      });
  }


  editInit(data){
    if (data.length > 0) {
      this.edit = true;
      let values = this._formService.shiftValuesToValueArr(data,'valueArr','values');
      // console.log(values);
      setTimeout(()=>{
        this.formBuilder.actions.setData(JSON.stringify(values));
      },100);
      this.form = JSON.parse(JSON.stringify(this.editFormModel.form));
    }
  }

  updateData(){
    let data = this._formService.trimLabel(this.formBuilder.actions.getData());
    // console.log(data);
    this.form.formName = this._formService.getFormName(data);
    let formData = this._formService.getFormArray(data,this.form.fieldsArr);
    // console.log(formData);
    this.form.fieldsArr = this._formService.shiftValuesToValueArr(formData,'values','valueArr');
    // submitted form
    console.log(this.form);

    this._formService.updateForm(this.form).subscribe(
      response => {
        // console.log(response);
        this.clearData();
        setTimeout(()=>{
          if(this.editFormModel.editf) this.router.navigate(['/form-list']);
          if(this.editFormModel.editIn) this.router.navigate(['/induction-list']);
        },1000);
      },
      error => {
        console.log(<any> error);
      });
  }

  

}
