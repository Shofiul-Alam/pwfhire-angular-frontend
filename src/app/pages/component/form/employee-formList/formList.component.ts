import { Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { FormRender } from "./../formbuilder/form-render";
import { FormService } from './../../../../services/admin/adminForm.service';
import { CommonService } from './../../../../services/common.service';
import {Form} from './../../../../models/Form';
import {UserFormSubmission} from './../../../../models/userFormSubmission';
import {UserService} from './../../../../services/user.service';
import {EditFormModel} from './../../../../models/formEditModel';



function dataRender() {
  (function($) {
    (<any>$).fn.formRender = function(options) {
    let elems = this;
    let formRender = new FormRender(options);
    elems.each(i => formRender.render(elems[i]));
  };

    /**
     * renders an individual field into the current element
     * @param {Object} data - data structure for a single field output from formBuilder
     * @param {Object} options - optional subset of formRender options - doesn't support container or other form
     *     rendering based options.
     * @return {DOMElement} the rendered field
     */
    (<any>$.fn).controlRender = function(data, options : any = {}) {
      options.formData = data;
      options.dataType = typeof data === 'string' ? 'json' : 'xml';
      let formRender = new FormRender(options);
      let elems = this;
      elems.each(i => formRender.renderControl(elems[i]));
      return elems;
    };
  })(jQuery);
}


@Component({
  selector: 'form-list',
  templateUrl: 'formList.component.html',
  styleUrls: ['formList.component.css']
})
export class FormListComponent implements OnInit, AfterViewInit {
  formRender: any; private token;
  modalElpe = null; 
  formDataList; selectedForm;
  formName; index:number;
  loader:boolean = false;
  identity; form:Form;
  formSubmision:UserFormSubmission;

  
  constructor(
    private _rootNode: ElementRef, 
    private _formService:FormService, 
    private router:Router,
    public sorting: CommonService,
    private _userService: UserService,
    ){
      this.form = new Form();
      this.formSubmision = new UserFormSubmission();
    }
  
  ngOnInit(){
    window.scrollTo(0, 0);
    this.getFormData();
    this.getEmployee();
    this.identity = JSON.parse(localStorage.getItem('identity'));
  }

  ngAfterViewInit(){
    this.modalElpe = $(this._rootNode.nativeElement).find('div.modal#previewForm');
  }

  getEmployee(){
    this._userService.getUser().subscribe(
        userData => {
          this.formSubmision.user = userData;
        },
        error => {
          console.log(<any> error);
        }
    );
  }


  getFormData(){
    this._formService.getForm().subscribe(
      response => {
        this.formDataList = response.data;
        console.log(response.data);
      },
      error => {
        console.log(<any> error);
      });
  }

  previewData(data){
    this.form = data;
    let x: any = {}; 

    x = this._formService.deleteProperty(data.fieldsArr);
    console.log(x);

    for(var i = 0; i < x.formData.length; i++) {
      if(typeof x.formData[i].valueArr != 'undefined' || x.formData[i].valueArr != null) {
        x.formData[i].values = x.formData[i].valueArr;
      }
    }
    
    this.selectedForm = x.addFormValue;
    this.form.formName = data.formName;
    this.modalElpe.modal('show');
    dataRender();
      var formRenderOpts = {
      formData: x.formData,
      dataType: 'json'
    }; 
    this.formRender = (<any>jQuery('.f-render')).formRender(formRenderOpts);
    this._formService.addClassFOrmControl();
    this._formService.floatLabel();
  }

  AddFormData(){
    this.loader = true;
    let formArr = $('form.addFormData').serializeArray();
    console.log(formArr);
    console.log(this.form);
    console.log(this.selectedForm);
    this.form.fieldsArr = this._formService.getFilledData(formArr,this.selectedForm);
    console.log(this.form);
    this.formSubmision.form = this.form;
    this._formService.saveFormData(this.formSubmision).subscribe(
        response => {
          console.log(response.data);
          this.loader = false;
          this.modalElpe.modal('hide');
        },
        error => {
          console.log(<any> error);
        });
  }
  

  

}
