import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {FieldValue} from './../../models/FieldValue';
import {Form} from './../../models/Form';
import { AllField } from './../../models/allField';
import { ValueArr } from './../../models/valueArr';
import {EditFormModel} from './../../models/formEditModel';


import {AdminGLOBAL} from "./adminGlobal";


@Injectable()
export class FormService {
    public formData: Array<any> = [];
    private url; 
    public token; private fieldValue:FieldValue; public form:Form;
    addNew:boolean = false; private allField: AllField;
    private valueArr: ValueArr; 
    public editFormModel:EditFormModel = new EditFormModel();

    constructor(private _http: Http) {
        this.url = AdminGLOBAL.url;
        this.fieldValue = new FieldValue();
        this.form = new Form();
        this.allField = new AllField();
    }
    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));

        if(token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    addForm(data) {

        let json = JSON.stringify(data);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/form/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateForm(data) {
        let json = JSON.stringify(data);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/form/update?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    

    getForm(){
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    	return this._http.post(this.url+'/form/forms?XDEBUG_SESSION_START=PHPSTORM', params,{headers: headers}).map(res=>res.json());
    }

     saveFormData(data) {
        let json = JSON.stringify(data);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/form/save-data?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getAllFormSubmissions() {
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/form/all-submissions?XDEBUG_SESSION_START=PHPSTORM', params,{headers: headers}).map(res=>res.json());
    }

    getSingleForm(formId){
        let json = JSON.stringify({"id":formId});
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/form/get-form?XDEBUG_SESSION_START=PHPSTORM', params,{headers: headers}).map(res=>res.json());
    }


    formRenderColumn(data,col:boolean){
        let col1 = Math.ceil((data.length-1)/2);
        let col2 = col1+1;
        let arr= [];
        if(col){
            for(let d=0; d<=col1;d++){
                arr.push(data[d]);
            }
        } else {
           for(col2; col2<data.length;col2++){
                arr.push(data[col2]);
            }
        }
        return arr;
    }



    createFormName(form){
	    let arr={};
	    let data = form;
	    let formName:string = '';
	    for(let i=0; i<data.length;i++){
	      if(data[i].type=== 'header'){
	        formName = data[i].label;
	        break;
	      }
	    }
	    arr = {
	      name: formName,
	      formData: data
	    }
	    return arr;
  	}

     deleteProperty(data){
        let list = JSON.parse(JSON.stringify(data));
        let addFormValue = [];
        for(let i of list){
            if(i.type!= 'header'){
                if(i.valueArr.length>0){
                    for(let j of i.valueArr){
                        this.fieldValueData(i);
                        this.fieldValue.valueArr = this.valueArrData(j);
                        addFormValue.push(this.fieldValue);
                        this.fieldValue = new FieldValue;
                    }
                } else {
                    this.fieldValueData(i);
                    this.fieldValue.valueArr = null;
                    addFormValue.push(this.fieldValue);
                    this.fieldValue = new FieldValue;       
                }
            } else {
                this.fieldValue.formId = i.form;
                this.fieldValue.fieldId = i.id;
                this.fieldValue['name'] = i.type;
                this.fieldValue.value = i.label;
                this.fieldValue.valueArr = null;
                addFormValue.push(this.fieldValue);
                this.fieldValue = new FieldValue; 
            }

            delete i.form;
            delete i.id; 
        }
        return {formData: list, addFormValue:addFormValue}
    }

    fieldValueData(i){
        this.fieldValue.formId = i.form;
        this.fieldValue.fieldId = i.id;
        this.fieldValue['name'] = i.name;
        this.fieldValue.value = i.value;
    }

    valueArrData(j){
        this.valueArr = new ValueArr();
        this.valueArr.label = j.label;
        this.valueArr.value = j.value;
        this.valueArr.id = j.id;
        return this.valueArr;
    }


    floatLabel(){ 
        $('.rendered-form .form-group .form-control').on('focus blur', function(e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');
    
      }
    
    addClassFOrmControl(){
        $( ".rendered-form .form-group input" ).addClass('form-control');
        $( ".rendered-form .form-group select" ).addClass('form-control');
        $( ".rendered-form .form-group textarea" ).addClass('form-control');
        $( ".rendered-form .form-group:has(input[type='date'])" ).addClass('label-focused');
        $( ".rendered-form .form-group:has(input[type='file'])" ).addClass('label-focused');
      }

    
    
    getFilledData(formArr,fom){
        this.form = new Form();
        for(let a=0; a<formArr.length;a++){
            if(formArr[a].name.endsWith('[]')) formArr[a].name = (formArr[a].name.replace('[]','')).trim();
            for(let i=0;i<fom.length;i++){ 
                if(fom[i].name == formArr[a].name){ 
                    if(fom[i].valueArr==null) {
                        fom[i].value = formArr[a].value;
                        this.deleteAddFormValue(fom,fom[i]);
                        break;
                    } else if(fom[i].valueArr.value == formArr[a].value) {
                        fom[i].valueArr.selected = true;
                        fom[i].valueArr.correct = true;
                        this.deleteAddFormValue(fom,fom[i]);
                        break;
                    }
                } else if(fom[i].name=='header'){
                    this.deleteAddFormValue(fom,fom[i]);
                    i = i-1;
                }
            }
        }
        return this.form.fieldsArr;
    }

    deleteAddFormValue(arr,a){
        delete a.name;
        this.form.fieldsArr.push(a);
        arr.splice(arr.indexOf(a),1);
    }

    shiftValuesToValueArr(formData,from:string,to:string){
        for(let i of formData) {
          if(typeof i[from] != 'undefined' || i[from] != null) {
            i[to] = i[from];
            i[from] = null;
          }
        }
        return formData 
    }
   

      getFormArray(data,fieldsArr){
        let x = [];
        for(let a=0; a<data.length;a++){    
            if(fieldsArr.length==0) this.addNew =true;
            for(let i=0;i<fieldsArr.length;i++){
                if(data[a].name==fieldsArr[i].name){
                    for(let field in data[a]){
                        if(field=='values' && data[a][field]!=null) {
                            for(let j of data[a][field]){
                                for(let k of fieldsArr[i]['valueArr']){
                                    if(j.label==k.label || j.value==k.value){
                                        j['id'] = !k.id? '0':k.id;
                                        j.correct = !k.correct? null:k.correct; 
                                        break;
                                    }
                                }
                                j['field'] = fieldsArr[i]['id'];
                                j.id = !j.id? '0':j.id;
                                j.selected = !j.selected? null:j.selected;  
                            }
                        } 
                        fieldsArr[i][field] = data[a][field];
                    }
                    x.push(fieldsArr[i]);
                    let ind = fieldsArr.indexOf(fieldsArr[i]);
                    fieldsArr.splice(ind,1);
                    break;
                }
                this.addNew =true;
            }
            if(this.addNew){
                for(let o in data[a]){
                    let form= new Form();
                    this.allField[o] = data[a][o];
                    form.id = fieldsArr.length==0? x[0].form:fieldsArr[0].form;
                    form.fieldsArr = null;
                    form.formName = null;
                    this.allField.form = form;
                }
                x.push(this.allField);
                this.addNew =false;
            } 
        }
        return x;
      }

    getFormName(data){
        for(let field of data){
            if (field.type=='header') {
                return field.label;
            }
        }
    }

    initForSubmitEdit(form,f){
        let id=[];
        
                for(let j of Object.values(f.fieldsArr)){
                for(let k of form.fieldsArr){
                  if(j.id === k.id){
                    if(k.valueArr.length>0){
                      for(let s of j.valueArr){
                          for(let m of k.valueArr){
                            if(s.id===m.id){
                              m.selected = true;
                              m.correct = true;
                              id.push(s.id);
                              break;
                            } else if(!id.includes(m.id)) {
                              m.selected = false;
                              m.correct = false;
                            }
                          }
                      }

                    } else {
                      k.value = j.value; 
                    }
                    break;
                  }
                }
              }
              // console.log(form);
              
              return this.deleteProperty(form.fieldsArr);  
                 
    }

    getUpdatedSubmittedInduction(formlist,f){
        let x = []; let id = [];
        let list = JSON.parse(JSON.stringify(formlist));
        // console.log(f);
        for(let k of list){
            if(k.id==f[0].formId){
                for(let i of k.fieldsArr){
                    for(let j of f){
                        if(i.id===j.fieldId){
                            if(i.valueArr.length>0){
                                for(let a of i.valueArr){
                                    if(a.id===j.valueArr.id){
                                        id.push(a.id);
                                        a.selected = j.valueArr.selected;
                                        a.correct = j.valueArr.correct;
                                    } else if(!id.includes(a.id)) {
                                      a.selected = false;
                                      a.correct = false;
                                    }
                                }
                            } else {
                                i.value = j.value;
                            }
                        }
                    }
                    x.push(i);
                }
                // console.log(x);
                break;
            }
        }
        return x;
            
    }


    initPDF(f){
        let data=[]; let id = [];
        data.push({label:'Form Name',value:f.formName,fieldId:''});
        // console.log(f);
        for(let k of Object.values(f.fieldsArr)){
            if(k.valueArr.length>0){
                for(let m of k.valueArr){
                     data.push({label:k.label,value:m.label,fieldId:k.id});
                }
                
            }else {
                if(k.type!='header') data.push({label:k.label,value:k.value,fieldId:k.id}); 
            }

        }
        return data;
    }

    getPdfdata(pdf){
        let pdfData = [];
        for(let i=0; i<pdf.length;i++){ 
          if(i!=0 && pdf[i].fieldId==pdf[i-1].fieldId){ 
            let x = pdfData.length;
            if(Array.isArray(pdfData[x-1].value)){
              if(pdfData.indexOf(pdf[i])!= -1) pdfData[x-1].value.push(pdf[i].value);
            } else { 
                let values = [];
                values.push(pdfData[x-1].value);
                pdfData[x-1].value = values;
                pdfData[x-1].value.push(pdf[i].value);
            }

          } else pdfData.push(pdf[i]);
        }
        return pdfData;
    }


    trimLabel(data){
        for(let i of data){ 
            let x = i.label.replace(/&.*;/g,'');
            i.label = x.trim();
        }
        return data;
    }

    findObject(arr,val){
        for(let i = 0; i<arr.length;i++){ 
          if (arr[i].id==val)
            return arr[i];
        }
        return null;
    }

    /*************CSV**************/

    formatCSVData(data){
       let arr = [], index =1;
       for(let f of data){
           let obj={
               "SL No": index++,
               "Form Name": f.formName
           };
           arr.push(obj);
       }
       return arr;
    }

    /*********Search***********/

    searchForm(data,form,prop){
        let results = [];
        if(data!=""){
          for(let ind of form){
            let search = data.toUpperCase();
            let name = ind[prop].toUpperCase();
            if(name.indexOf(search)>-1) results.push(ind);
          }
          return results;
        }
        return form
      }


}