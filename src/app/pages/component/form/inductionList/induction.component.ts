import { Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { FormRender } from "./../formbuilder/form-render";
import { FormService } from './../../../../services/admin/adminForm.service';
import { FormData } from './../../../../models/formData';
import { CommonService } from './../../../../services/common.service';
import { SubmittedInduction } from './../../../../models/SubmittedInduction';
import {Form} from './../../../../models/Form';
import {InductionService} from "../../../../services/admin/adminInduction.service";
import {Induction} from "../../../../models/Induction";
import {UserFormSubmission} from "../../../../models/userFormSubmission";
import {UserService} from "../../../../services/user.service";
import {EditFormModel} from './../../../../models/formEditModel';
import { ExportCSV } from './../../../../services/exportCSV.service';



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
  formRender: any;  identity; search:string='';
  modalElpe = null; modalElde = null; modal=null;
  loader:boolean = false;
  submitInduction:SubmittedInduction;
  formSelect; code; status;
  formName; 
  inductionArray: Array<any>= [];
  public filterInductions:Array<any>= [];
  formArray: Array<any>= [];
  formRenderOpts;
  selectedForm;
  formSubmision:UserFormSubmission;
  induction:Induction;
  form:Form;
  
  public get editFormModel() {
    return this._formService.editFormModel;
  }
  public set editFormModel(value) {
    this._formService.editFormModel = value;
  }


  
  constructor(
    private _rootNode: ElementRef, 
    private _formService:FormService, 
    private router:Router,
    public sorting: CommonService,
    private _inductionService: InductionService,
    private _userService: UserService,
    private exportCSV:ExportCSV
    ){
      this.form = new Form();
  }
  
  ngOnInit(){
    this.induction = new Induction();
    this.formSubmision = new UserFormSubmission();
    window.scrollTo(0, 0);
    this.identity = JSON.parse(localStorage.getItem('identity'));
    this.initForm();
    this.getInductionData();
    this.getFormArray();
    this.getEmployee();

  }

  ngAfterViewInit(){
    this.modalElpe = $(this._rootNode.nativeElement).find('div.modal#Form');
    this.modal = $(this._rootNode.nativeElement).find('div.modal');
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

  edit(data) {
    // console.log(data);
    this.editFormModel.editIn = true;
    this.editFormModel.form = JSON.parse(JSON.stringify(data));
    let x = this._formService.deleteProperty(data.fieldsArr);
    this.editFormModel.formData = x.formData;
    // console.log(x);
    this.router.navigate(['/create-form']);
  }


  initForm(){
    this.submitInduction = new SubmittedInduction(); 
    this.sorting.floatLabel();
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

  getFormArray(){
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

  formChanged(data: {value: string[]}){
     this.formSelect = this._formService.findObject(this.formArray, data.value);
     delete this.formSelect.text;
     // console.log(this.formSelect);
  }

  getInductionData(){
    this._inductionService.allInduction().subscribe(
      response => {
        this.inductionArray = response.data;
        console.log(this.inductionArray);
        this.filterInductions = JSON.parse(JSON.stringify(this.inductionArray));
      },
      error => {
        console.log(<any> error);
      });
  }


  addInduction(){
    this.loader = true;
    this.submitInduction.form = this.formSelect;

    this._inductionService.addInduction(this.submitInduction).subscribe(
        response => {
          // console.log(response);
          // if(response) {
          //   this.router.navigate(['/form-list']);
          // }
          setTimeout(()=>{
            this.initForm();
            this.modal.modal('hide');
            this.loader = false;
            this.getInductionData();
          },2000)
        },
        error => {
          console.log(<any> error);
        });

  }



  fillForm(data){
    this.induction = data;
    let x: any = {}; 
    // mostafiz///////
     x = this._formService.deleteProperty(data.form.fieldsArr);
    console.log(x);

    for(var i = 0; i < x.formData.length; i++) {
      if(typeof x.formData[i].valueArr != 'undefined' || x.formData[i].valueArr != null) {
        x.formData[i].values = x.formData[i].valueArr;
      }
    }
    this.selectedForm = x.addFormValue;
    this.form.formName = data.formName;

    // mostafiz end////////////////
    
    this.modalElpe.modal('show');
    dataRender();
    let formRenderCol1 = {
      formData: this._formService.formRenderColumn(x.formData,true),
      dataType: 'json'
    }; 
    let formRenderCol2 = {
      formData: this._formService.formRenderColumn(x.formData,false),
      dataType: 'json'
    }; 
    this.formRender = (<any>jQuery('.f-render-col1')).formRender(formRenderCol1);
    this.formRender = (<any>jQuery('.f-render-col2')).formRender(formRenderCol2);
    this._formService.addClassFOrmControl();
    this._formService.floatLabel();
  }

  submitData(){
    this.loader = true;
    let dArr = $('form.fillInduction').serializeArray();
    // console.log(dArr);

    // let valueA = this._formService.getFilledData(dArr,this.induction.form.fieldsArr);
    this.induction.form.fieldsArr = this._formService.getFilledData(dArr,this.selectedForm);
    // console.log(this.induction);

    this.formSubmision.form = this.induction.form;

    console.log(this.formSubmision,this.induction.id);
    
    this._inductionService.saveInductionData(this.formSubmision, this.induction.id).subscribe(
        response => {
            // console.log(response);
            this.loader = false;
            this.modal.modal('hide');
            this.router.navigate(['submitted-induction']);
        },
        error => {
          console.log(<any> error);
        });

    
  }

   /***********Export CSV****************/

  downLoadCSV(){
    if(this.inductionArray){
      let formtedData = this._inductionService.formatCSVData(this.inductionArray);
      this.exportCSV.downloadCSV({ filename: "Induction-Data-Table.csv", title:'Induction List' }, formtedData);
    }
  }

  /**************Search****************/
  searchInduction(f:string){
    this.inductionArray = this._formService.searchForm(f,this.filterInductions,'name');
  }




}

