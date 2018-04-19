import { Component, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { ValidationService } from './../../../../services/formValidation.service';
import { SkillCompetencyManagement } from './../../../../services/admin/adminSkillCompetency.service';
import { SkillCompetencyList } from './../../../../models/SkillCompetencyList';
import {Pagination} from "./../../../../models/pagination";
import {ExtraData} from './../../../../models/extraData';
import { ExportCSV } from './../../../../services/exportCSV.service';


@Component({
  selector: 'skill-competency-list',
  templateUrl: 'addSkillCompetency.component.html',
  styleUrls: ['addSkillCompetency.component.css']
})
export class AddSkillCompetencyComponent implements OnInit {

  public skillcompetency: SkillCompetencyList;
  public skillcompeteArray: Array<SkillCompetencyList>= [];
  public filterSkillcompeteArray: Array<SkillCompetencyList>= [];
  public pagination:Pagination;
  public extra:ExtraData;
  public search:string = '';

  constructor(
      private validationForm: ValidationService,
      private _skillCompetencyService: SkillCompetencyManagement,
      private _rootNode: ElementRef,
      private exportCSV:ExportCSV
  ){
    this.skillcompetency = new SkillCompetencyList();
    this.pagination = new Pagination();
    this.extra = new ExtraData();
  }    

  ngOnInit(){
    this.listData();
    window.scrollTo(0, 0);
    this.validationForm.floatLabel();
  }

  ngAfterViewInit() {
    this.extra.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  loadPage(page: number) {
    this.pagination.page = page;
    this.listData();
  }


  listData (){
    this._skillCompetencyService.getSkillList(this.pagination.page).subscribe(
        response => {
            this.skillcompeteArray = response.data;
            console.log(response);
            this.pagination.total_items_count = response.total_items_count;
            this.pagination.pageSize = response.items_per_page;
            this.filterSkillcompeteArray = this.skillcompeteArray;
        },
        error => {
          console.log(<any> error);
        }
    );
  }

  initSkillCompetency() {
    this.extra.editTrue = false;
    this.skillcompetency= new SkillCompetencyList();
    setTimeout(()=>{this.validationForm.floatLabel()},100);
  }

  onSubmit(f) {
    this.extra.loader = true;
    this._skillCompetencyService.add(this.skillcompetency).subscribe(
        response => {
          this.extra.code = response.code;
          console.log(response);
          if(response.code != 200) {
            this.validationForm.getResponce(response,this.extra);
          } else {
            this.skillcompeteArray.push(response.SkillCompetencyList);
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

   initEditSkillCompetency(sco) {
      this.extra.editTrue = true;
      this.skillcompetency = new SkillCompetencyList();
      this.skillcompetency = sco;
      setTimeout(()=>{this.validationForm.floatLabel()},100);
  }

    onUpdate() {  
        console.log(this.skillcompetency);
        this.extra.loader = true;
        this._skillCompetencyService.update(this.skillcompetency).subscribe(
            response => {
                this.extra.code = response.code;
                console.log(response);
                if(response.code != 200) {
                    this.validationForm.getResponce(response,this.extra);
                } else {
                    this.validationForm.getResponce(response,this.extra);
                    this.extra.modalEl.modal('hide');
                    this.extra.editTrue = false;  
                }
            },
            error => {
                console.log(<any> error);
                this.validationForm.errorStatus(error,this.extra);
            }
        );
    }

  initArchive(skill,index){
    this.skillcompetency = skill;
    this.extra.index = index;
  }

  archiveData(){
    this.skillcompeteArray.splice(this.extra.index,1);
  }

  /***********Search*************/

  searchSkill(f){
    this.skillcompeteArray = this._skillCompetencyService.searchSkill(f,this.filterSkillcompeteArray);
  }

   /***********Export CSV****************/

  downLoadCSV(){
    if(this.skillcompeteArray){
      let formtedData = this._skillCompetencyService.formatCSVData(this.skillcompeteArray);
      this.exportCSV.downloadCSV({ filename: "Skill-Compentency-Data-Table.csv", title:'Skill Compentency List' }, formtedData);
    }
  }




}
