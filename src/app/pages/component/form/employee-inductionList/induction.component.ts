import { Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { FormRender } from "./../formbuilder/form-render";
import { FormData } from './../../../../models/formData';
import { CommonService } from './../../../../services/common.service';
import { SubmittedInduction } from './../../../../models/SubmittedInduction';
import {Form} from './../../../../models/Form';
import {EmployeeInductionsService} from "../../../../services/inductions.service";
import {Induction} from "../../../../models/Induction";
import {UserFormSubmission} from "../../../../models/userFormSubmission";
import {EmployeeService} from "../../../../services/employee.service";
import {FormMethodsService} from "../../../../services/formMethods.service";
import {UserSubmittedInduction} from './../../../../models/userSubmittedInduction';
import {ExtraData} from './../../../../models/extraData';
import {Pagination} from "./../../../../models/pagination";



declare var jsPDF: any;


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
  selector: 'induction-list',
  templateUrl: 'induction.component.html',
  styleUrls: ['induction.component.css']
})
export class InductionListComponent implements OnInit, AfterViewInit {
  formRender: any; search:string='';
  submitInduction:SubmittedInduction;
  inductionArray: Array<any>= [];
  formRenderOpts;
  selectedForm;
  formSubmision:UserFormSubmission;
  editInductionFormData:UserSubmittedInduction;
  induction:Induction;
  form:Form;
  extra:ExtraData;
  pdfData; formName;
  public pagination:Pagination;
  public filterInductions:Array<any>= [];
  public userInductionData:Array<UserSubmittedInduction> = [];
  public editInductionForm = false;

  
  
  constructor(
    public validation:ValidationService,
    private _rootNode: ElementRef,  
    private router:Router,
    public sorting: CommonService,
    private _inductionService: EmployeeInductionsService,
    private _empService: EmployeeService,
    private _formService: FormMethodsService
    ){
      this.form = new Form();
      this.extra = new ExtraData();
      this.pagination = new Pagination();
      this.init();
  }

  init(){
    this.induction = new Induction();
    this.formSubmision = new UserFormSubmission();
    this.editInductionFormData = new UserSubmittedInduction();
  }
  
  ngOnInit(){
    window.scrollTo(0, 0);
    this.initForm();
    this.getInductionData();
    this.getUserSubmittedInduction();
  }

  getUserSubmittedInduction() {
    this._inductionService.getEmployeeSubmittedInduction().subscribe(
        response=>{
          console.log(response);
          if(response.code==200){
            this.userInductionData = response.data;
            if(this.userInductionData.length > 0) {
              this.editInductionForm = true;
            }
          }
        });
  }


  ngAfterViewInit(){
    this.extra.modalElOpen = $(this._rootNode.nativeElement).find('div.modal#previewInduction');
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }


  initForm(){
    this.submitInduction = new SubmittedInduction(); 
    this.validation.floatLabel();
  }

  reset(f){
    this.initForm();
    f.form.reset();
  }

  renderForm(data){
    dataRender();
      let formRenderOpts = {
      formData: data,
      dataType: 'json'
    }; 
    this.formRender = (<any>jQuery('.f-render')).formRender(formRenderOpts);
  }

  loadPage(page: number) {
    this.pagination.page = page;
    // console.log(this.pagination.page);
    this.getInductionData();
  }


  getInductionData(){
    this._inductionService.getEmployeeInductionForms().subscribe(
      response => {
        this.inductionArray = response.data;
        this.filterInductions = JSON.parse(JSON.stringify(response.data));
        console.log(response);
      },
      error => {
        console.log(<any> error);
      });
  }

  /*************Fill data**************/

  fillInduction(data,index){
    this.init();
    this.extra.index = index;
    this.extra.con = false;
    this.induction = data.induction;
    this.formSubmision.user = data.employee;
    this.previewInduction(data.induction.form);
  }

  addInductionData(){
    this.extra.loader = true;
    let dArr = $('form.Induction-Form').serializeArray();
    console.log(dArr);
    this.induction.form.fieldsArr = this._formService.getFilledData(dArr,this.selectedForm);
    this.formSubmision.form = this.induction.form;
    console.log(this.formSubmision,this.induction.id);  

    this._inductionService.saveEmployeeOnlyInductionData(this.formSubmision, this.induction.id).subscribe(
      response => {
        this.extra.code = response.code;
        if(response.code==200){
          // console.log(response);
          this.validation.getResponce(response,this.extra);
          this.extra.modalEl.modal('hide');
        } else {
          this.validation.getResponce(response,this.extra);
        }
      },
      error => {console.log(<any> error); this.extra.loader = false;}
    );
  }

/***************** Edit********************/

  editInduction(data){
    this.init();
    console.log(data);
    this.extra.con = true;
    this.induction = data.induction;
    if(this.editInductionForm) {
      let userInductionData = this.findById(this.userInductionData, data.induction.form.id)
      console.log(userInductionData);
      this.formSubmision.id = data.id;
      this.formSubmision.user = userInductionData.user;
      let inducForm:Form = this._formService.initForSubmitEdit(data.induction.form, userInductionData.induction.form);
      console.log(inducForm);
      let form = JSON.parse(JSON.stringify(inducForm))
      this.previewInduction(form);
    }


  }

  updateInductionData(){
    this.extra.loader = true;
    let dArr = $('form.Induction-Form').serializeArray();
    console.log(dArr);
    this.induction.form.fieldsArr = this._formService.getFilledData(dArr,this.selectedForm);
    this.editInductionFormData.induction = this.induction;
    console.log(this.formSubmision,this.induction.id); 

    this._inductionService.updateInductionData(this.editInductionFormData, this.induction.id).subscribe(
      response => {
        this.extra.code = response.code;
        if(response.code==200){
          // console.log(response);
          this.validation.getResponce(response,this.extra);
          this.extra.modalEl.modal('hide');
        } else {
          this.validation.getResponce(response,this.extra);
        }
      },
      error => {console.log(<any> error); this.extra.loader = false;}
    ); 
  }

  /************** Preparing for preview****************/

  previewInduction(inducForm){
    let x: any = {}; 
    x = this._formService.deleteProperty(inducForm.fieldsArr);

    for(var i = 0; i < x.formData.length; i++) {
      if(typeof x.formData[i].valueArr != 'undefined' || x.formData[i].valueArr != null) {
        x.formData[i].values = x.formData[i].valueArr;
      }
    }
    this.selectedForm = x.addFormValue;
    this.form.formName = inducForm.formName;
          
    this.extra.modalElOpen.modal('show');
    dataRender();
      var formRenderOpts = {
        formData: x.formData,
        dataType: 'json'
      }; 
    this.formRender = (<any>jQuery('.f-render')).formRender(formRenderOpts);
    this._formService.addClassFOrmControl();
    this._formService.floatLabel();
  }


/***************Download pdf****************************/

  initDownload(data){
      let userInductionData = this.findById(this.userInductionData, data.induction.form.id)
      let pdf = this._formService.initPDF(userInductionData.induction.form);
      let x = JSON.parse(JSON.stringify(pdf));
      this.pdfData = this._formService.getPdfdata(x);
      this.formName = userInductionData.induction.name;
  }

  printPdfForm(){
    this._formService.printPdfForm(this.formName);
  }

  isArrayCheck(p){
    if(Array.isArray(p)) return true;
    return false;
  }

/**************Search****************/
  searchInduction(f:string){
    this.inductionArray = this._formService.searchInduction(f,this.filterInductions);
  }

  findById(input, id) {
    for (var i = 0; i<input.length; i++) {
      if (input[i].induction.form.id == id) {
        return input[i];
      }
    }
    return null;
  };

  findInductionById(input, id) {
    for (var i = 0; i<input.length; i++) {
      if (input[i].induction.encryptedId == id) {
        return input[i];
      }
    }
    return null;
  };


  isEditable(data) {
      let findD = this.findInductionById(this.userInductionData, data.induction.id);

      if(findD == null) {
        return false;
      } else {
        return true;
      }
  }

  



}

