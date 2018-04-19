import { Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import {Router} from '@angular/router';
import { FormRender } from "./../formbuilder/form-render";
import { FormService } from './../../../../services/admin/adminForm.service';
import { FormData } from './../../../../models/formData';
import { CommonService } from './../../../../services/common.service';
import {Form} from './../../../../models/Form';
import {UserFormSubmission} from './../../../../models/userFormSubmission';


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
  selector: 'submitForm-list',
  templateUrl: 'submitForm.component.html',
  styleUrls: ['submitForm.component.css']
})
export class SubmittedFormComponent implements OnInit, AfterViewInit {
  formRender: any; loader: boolean = false;
  modal=null; modalElpe = null; 
  private updateFieldValue;
  formDataList:Array<UserFormSubmission>; private formList:Array<Form> = [];
  form:Form; private editForm:UserFormSubmission;
  pdfData; formName;
  

  
  constructor(
    private _rootNode: ElementRef, 
    private _formService:FormService, 
    private router:Router,
    public sorting: CommonService,
    ){
      this.form = new Form();
    }
  
  ngOnInit(){
    window.scrollTo(0, 0);

    this.getFormData();

    this.getAllFormSubmission();
    
  }

  ngAfterViewInit(){
    this.modal = $(this._rootNode.nativeElement).find('div.modal');
    this.modalElpe = $(this._rootNode.nativeElement).find('div.modal#previewForm');
  }

  getAllFormSubmission() {
    this._formService.getAllFormSubmissions().subscribe(
        response => {
          this.formDataList = response.data;
          // console.log(this.formDataList);
        },
        error => {
          console.log(<any> error);
        });
  }

  getFormData(){
    this._formService.getForm().subscribe(
      response => {
        this.formList = response.data;
        // console.log(this.formList);
      },
      error => {
        console.log(<any> error);
      });
  }

 
  renderForm(data){
    dataRender();
      let formRenderOpts = {
      formData: data,
      dataType: 'json'
    }; 
    this.formRender = (<any>jQuery('.f-render')).formRender(formRenderOpts);
  }

  edit(f){
    this.editForm = JSON.parse(JSON.stringify(f));
    // console.log(f.induction.form.id); 
    let formId = f.induction.form.id;
    let form:Form;
   this._formService.getSingleForm(formId).subscribe(
      res => { 
        // console.log(res);
        form = res.data;    
        // console.log(form); 
        let renderedForm = this._formService.initForSubmitEdit(form,this.editForm.form);
        // console.log(renderedForm); 
        for(var i = 0; i < renderedForm.formData.length; i++) {
          if(typeof renderedForm.formData[i].valueArr != 'undefined' ||renderedForm.formData[i].valueArr != null) {
            renderedForm.formData[i].values = renderedForm.formData[i].valueArr;
          }
        }

        this.updateFieldValue = renderedForm.addFormValue;
        dataRender();
        let formRenderCol1 = {
          formData: this._formService.formRenderColumn(renderedForm.formData,true),
          dataType: 'json'
        }; 
        let formRenderCol2 = {
          formData: this._formService.formRenderColumn(renderedForm.formData,false),
          dataType: 'json'
        }; 
        this.formRender = (<any>jQuery('.f-render-col1')).formRender(formRenderCol1);
        this.formRender = (<any>jQuery('.f-render-col2')).formRender(formRenderCol2);
        this._formService.addClassFOrmControl();
        this._formService.floatLabel();
        this.modalElpe.modal('show');
    });
    
  }


  updateData(){
    this.loader = true;
    let formArr = $('form.editFormData').serializeArray();
    let fields = this._formService.getFilledData(formArr,this.updateFieldValue);
    this.editForm.form.fieldsArr = this._formService.getUpdatedSubmittedInduction(this.formList,fields);
    // console.log(this.editForm);
    setTimeout(()=>{
      this.loader = false;
      this.modal.modal('hide');
    },1000);
  }


  opneFormFields(form){
    let pdf = this._formService.initPDF(form.form);
    let x = JSON.parse(JSON.stringify(pdf)); 
    this.pdfData = this._formService.getPdfdata(x);
    this.formName = form.name;
    // console.log(x,this.pdfData);
  }

  isArrayCheck(p){
    if(Array.isArray(p)) return true;
    return false;
  }
  
  printPdfForm(){
    let title = this.formName;
    var doc = new jsPDF('p', 'pt');

    var res = doc.autoTableHtmlToJson(document.getElementById("fieldsTable"));

    var options = {
        theme:'grid',
        styles: {
          overflow: 'linebreak', // visible, hidden, ellipsize or linebreak
          halign: 'left', // left, center, right
          valign: 'middle' // top, middle, bottom
      },
        margin: {top: 60},
        addPageContent: function(data) {
          doc.text(title, 40, 40);
        }
    };

    doc.autoTable(res.columns, res.data, options);

    doc.save("table.pdf");

  }



  


}

