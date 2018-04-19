import {Injectable} from '@angular/core';
import {FieldValue} from './../models/FieldValue';
import {Form} from './../models/Form';
import { AllField } from './../models/allField';
import { ValueArr } from './../models/valueArr';

declare var jsPDF: any;


@Injectable()
export class FormMethodsService {
    public formData: Array<any> = [];
    private fieldValue:FieldValue; 
    public form:Form;
    addNew:boolean = false; private allField: AllField;
    private valueArr: ValueArr; 

    constructor() {
        this.fieldValue = new FieldValue();
        this.form = new Form();
        this.allField = new AllField();
    }

    
     deleteProperty(data){
        let list = JSON.parse(JSON.stringify(data));
        let addFormValue = [];
        for(let i of list){
            if(i.type!= 'header'){
                if(i.valueArr!=null && i.valueArr.length>0){
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
   

    initForSubmitEdit(form:Form,f:Form){
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
        return form;             
    }



    initPDF(f:Form){
        let data=[]; let id = [];
        data.push({label:'Form Name',value:f.formName,fieldId:''});
        console.log(f);
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

    searchInduction(data,inductions){
        let results = [];
        if(data!=""){
          for(let ind of inductions){
            let search = data.toUpperCase();
            let name = ind.induction.name.toUpperCase();
            if(name.indexOf(search)>-1) results.push(ind);
          }
          return results;
        }
        return inductions
      }

    printPdfForm(formName){
        let title = formName;
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