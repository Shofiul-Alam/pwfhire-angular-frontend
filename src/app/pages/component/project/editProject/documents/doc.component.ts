import { Component, OnInit,Input,AfterViewInit, ElementRef } from '@angular/core';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {ExtraData} from './../../../../../models/extraData';
import {ProjectUploadDoc} from './../../../../../models/projectUploadDoc';
import {Project} from './../../../../../models/project';
import {AdminGLOBAL} from './../../../../../services/admin/adminGlobal';
import {UploadService} from "../../../../../services/upload.service";
import { ValidationService } from './../../../../../services/formValidation.service';
import { ImagePopUpService } from './../../../../../services/imagePopUp.service';
import {ProjectManagement} from "../../../../../services/admin/projectManagement.service";




@Component({
  selector: 'edit-project-doc',
  templateUrl: 'doc.component.html',
  styleUrls: ['doc.component.css'],
  providers: [NgbDatepickerConfig]
})
export class EditDocComponent implements OnInit,AfterViewInit {
    public extra:ExtraData;
    public proUploadDoc:ProjectUploadDoc;
    public filesToUpload: Array<File>;
    public docUpload: any;
    public docImage:string = '';
    public projectDoc:Array<any> = [];
    public mainProjectDoc:Array<any> = [];
    public url = AdminGLOBAL.url;

    @Input('project') public project:Project = new Project();

	constructor(
      config: NgbDatepickerConfig,
      public validationForm: ValidationService,
      private _uploadService: UploadService,
      private _projectService: ProjectManagement,
      public imagePopUp:ImagePopUpService,
      private _rootNode: ElementRef
	){
    this.extra = new ExtraData();
		config.minDate = {year: 2015, month: 1, day: 1};
    config.maxDate = {year: 2050, month: 12, day: 31};
	}

  ngOnInit() {
    this.proUploadDoc = new ProjectUploadDoc ();
    this.getProjectDoc();
  }

  ngAfterViewInit(){
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  removeFile(){
    let file:any =  $(this._rootNode.nativeElement).find('.dropify');
    let a =file.dropify();
    a.on('dropify.afterClear', ()=>{
        this.docUpload = null;
    });
  }

  changeDoc(){
    this.extra.editAvatar= true;
    this.extra.tsk = true;
    setTimeout(()=>{this._uploadService.avatarUpload();
      this.removeFile();
      $('.upload-pdf .dropify-wrapper').css('height','80px');
    },100)
  }
  cancleChange(){
      this.extra.editAvatar= false;
      this.extra.tsk = false;
      $(".dropify-clear").trigger("click");
      this.docUpload = null;
  }

  /******get Doc************/

   getProjectDoc(){
     this._projectService.getProjectDocument().subscribe(
       res=>{
         this.projectDoc = res;
         this.mainProjectDoc = this.projectDoc;
         console.log(res);
       },
       error=> console.log(error)
      );
   }

   checkPdf(a){
      return this.validationForm.checkPdf(a);
    }

  /************Add**************/

    initUploadDoc(){
      this.extra.loader = false;
      this.proUploadDoc = new ProjectUploadDoc ();
      this.extra.editAvatar = true;
      this.extra.tsk = false;
      this.extra.editTrue = false;  
      setTimeout(()=>{
        this._uploadService.avatarUpload();
        this.validationForm.floatLabel();
      },100);
    }

    addDocument (f){
      this.extra.loader = true;
      this.proUploadDoc.project = this.project;
      console.log(this.proUploadDoc, this.docUpload);
      setTimeout(()=>{
        f.form.reset();
        this.extra.modalEl.modal('hide');
      },2000); 
    }

    /**********Edit*************/

    initEditUploadDoc(data){
      this.extra.loader = false;
      this.proUploadDoc = new ProjectUploadDoc ();
      this.extra.editTrue = true;
      this.extra.editAvatar = false;
      this.proUploadDoc.id = data.documentId;
      this.proUploadDoc.title = data.documentTitle;
      this.proUploadDoc.description = data.description;
      this.docImage = data.documentPath + data.documentName;
      setTimeout(()=>{
        this.validationForm.floatLabel();
      },100); 
    }

    updateDocument(){
      this.extra.loader = true;
      this.proUploadDoc.project = this.project;
      console.log(this.proUploadDoc, this.docUpload);
      setTimeout(()=>{
        this.extra.editTrue = false;
        this.extra.modalEl.modal('hide');
      },2000); 
    }

    /********Archive**************/

    initArchive(data,index){
      this.extra.index = index;
      this.extra.loader = false;
    }

    archiveData(){
      this.extra.loader = true;
      let deletData = this.projectDoc[this.extra.index];
      setTimeout(()=>{
        console.log(deletData);
        this.projectDoc.splice(this.extra.index,1);
        this.extra.modalEl.modal('hide');
      },2000);
    }


    fileChangeEvent(fileInput:any, b:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        let bar = b;
        let token;
        let url = "/upload?XDEBUG_SESSION_START=PHPSTORM";
        this._uploadService.makeFileRequest(url, ['image'], this.filesToUpload,bar).then(
            (result) => {
                this.docUpload = result['upload'];
            },
            (error) => {
                console.log(error);
            });
    }

    reset(){
        this.extra.editTrue = false;
        this.extra.editAvatar= false;
        this.extra.tsk = false;
    }



}
