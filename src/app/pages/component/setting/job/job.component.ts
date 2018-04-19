import { Component, OnInit,ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import { JobService } from './../../../../services/admin/job.service';
import { Job } from './../../../../models/Job';
import { Select2OptionData } from 'ng2-select2';
import { SkillCompetencyManagement } from './../../../../services/admin/adminSkillCompetency.service';
import {SkillCompetencyList} from './../../../../models/SkillCompetencyList';
import {ExtraData} from './../../../../models/extraData';
import {Pagination} from "./../../../../models/pagination";
import { ExportCSV } from './../../../../services/exportCSV.service';



@Component({
  selector: 'job',
  templateUrl: 'job.component.html',
  styleUrls: ['job.component.css']
})
export class EmpOrderCategoryComponent implements OnInit {
    public options: Select2Options;
    public job: Job; search:string = '';
    public jobList: Array <Job>=[];
    public filterJobList: Array <Job>=[];
    public compentencyValue =[];
    public skillCompetencyArray: Array<SkillCompetencyList>=[];
    public extra:ExtraData;
    public skillcompetency: SkillCompetencyList;
    public pagination:Pagination;

  constructor(
      private validationForm: ValidationService,
      private jovService: JobService,
      private _rootNode: ElementRef,
      private _skillcompetencyService: SkillCompetencyManagement,
      private exportCSV:ExportCSV
  ){
    this.job = new Job();
    this.extra = new ExtraData();
    this.skillcompetency = new SkillCompetencyList();
    this.pagination = new Pagination();
  }


    ngOnInit() {
        this.listData();
        window.scrollTo(0, 0);
        this.compentencylist();
        this.validationForm.floatLabel();
        this.options = {
          multiple: true
        };
    }

    ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  compentencyDetails(f){
    this.skillcompetency = f;
    console.log(f);
  }

  colorContact(i){
    return this.validationForm.colorContact(i);
  }

  
  changeCompentency(data: {value: string[]}) {
    this.job.skillCompetencyList = this.jovService.getMultiSelectData(this.skillCompetencyArray,data);
    console.log(this.job.skillCompetencyList);
  }

  compentencylist (){
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

    loadPage(page: number) {
      this.pagination.page = page;
      this.listData();
    }

    listData (){
        this.jovService.getJobs(this.pagination.page).subscribe(
            response => {
                this.jobList = response.data;
                console.log(response);
                this.pagination.total_items_count = response.total_items_count;
                this.pagination.pageSize = response.items_per_page;
                this.filterJobList = this.jobList;
            },
            error => {
                console.log(<any> error);
            }
        );
  }

  initEdit(f){
    this.job = new Job();
    setTimeout(()=>{this.validationForm.floatLabel()},100);
    this.extra.editTrue = true;
    console.log(f);
    this.job = f;
    this.compentencyValue = this.jovService.findId(f.skillCompetencyList);
    console.log(this.compentencyValue);
  }

    updateJob(){
        this.extra.loader = true;
        console.log(this.job);
        this.jovService.updateJob(this.job).subscribe(
            response => {
                this.extra.code = response.code;
                console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                  } else {
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

    
    initAdd(){
      this.extra.editTrue = false;
      this.job = new Job();
      this.compentencyValue = [];
      setTimeout(()=>{this.validationForm.floatLabel()},100);
    }

    onSubmit(f) {
        this.extra.loader = true;
        console.log(this.job);
        this.jovService.addJob(this.job).subscribe(
            response => {
                this.extra.code = response.code;
                console.log(response);
                if(response.code != 200) {
                  this.validationForm.getResponce(response,this.extra);
              } else {
                this.jobList.push(response.Job);
                console.log(this.jobList);
                this.validationForm.successRes(response,f,this.extra);
                this.extra.modalEl.modal('hide');
              }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
    }

    reset(f){
    f.form.reset();
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }

  initArchive(data){
      this.job = JSON.parse(JSON.stringify(data));
      this.job.archived = true;
      this.extra.index = this.jobList.indexOf(data);
      console.log(this.extra.index);
    }

    archiveData(){
        this.extra.loader = true;
        this.jovService.archiveJob(this.job).subscribe(
          res => {
              console.log(res);
              this.extra.code = res.code;
              if(res.code = 200){
                this.jobList.splice(this.extra.index,1);
                this.validationForm.getResponce(res,this.extra);
                this.extra.modalEl.modal('hide');
              } else this.validationForm.getResponce(res,this.extra);
          }, err => {
              console.log(<any> err);
              this.validationForm.errorStatus(err,this.extra);
          }
        );  
    }

    /*******Search*********/

    searchJob(f){
      this.jobList = this.jovService.searchJob(f,this.filterJobList);
    }

    /***********Export CSV****************/

  downLoadCSV(){
    if(this.jobList){
      let formtedData = this.jovService.formatCSVData(this.jobList);
      this.exportCSV.downloadCSV({ filename: "Position-Data-Table.csv", title:'Position List' }, formtedData);
    }
  }
 
 
}
