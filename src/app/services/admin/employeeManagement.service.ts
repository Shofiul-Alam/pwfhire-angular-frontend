
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {AdminGLOBAL} from "./adminGlobal";
import {Employee} from "./../../models/employee";
import {EmpListFilter} from "./../../models/employeeFilter";
import {ValidationService} from "./../formValidation.service";

@Injectable()
export class EmployeeManagementService {
    public url:string;
    public identity;
    public token;
    public employee:Employee = new Employee();
    private cUrl: string = './assets/api/countries.json';

    constructor(private _http: Http,public validationForm: ValidationService,) {
        this.url = AdminGLOBAL.url;
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

    getUser(page?) {
        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-employee/list?page='+ page +'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    getAllEmp() {
        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-employee/list?&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    add(user) {
        let json = JSON.stringify(user);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    addDataWithAvatar(data, avatar, userDeclearation) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(avatar);
        let userDecleare = JSON.stringify(userDeclearation);
        let params = "json="+json+"&upload="+empUpload +'&userDeclearation='+userDecleare+'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update) {
        let json = JSON.stringify(usert_to_update);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateDataWithAvatar(data, avatar) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(avatar);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    deleteSkillDoc(id){
        let json = JSON.stringify(id);
        let params = "json="+json+'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/delete-employee-doc?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }


    getEmployeeDocuments(data,page?){
        let json = JSON.stringify(data);
        let params = "json="+json+'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/employee-documents?page='+page+'&XDEBUG_SESSION_START=PHPSTORM&page='+ page, params, {headers: headers}).map(res => res.json());
    }

    updateEmployeeDoc(data, empUp) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(empUp);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/update-employee-doc?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }


    getCounrt(){
        return this._http.get(this.cUrl).map(res => res.json());
    }

    getCountryFromSelect(arr,f){
        for(let i of arr){
            if(i.id===f) {
                return i.text;
            }
        }
        return;
    }

    approve(employee) {
        let json = JSON.stringify(employee);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/approve-employee?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    isArchive(employee) {
        let json = JSON.stringify(employee);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/archive-employee?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    checkCountry(data,con){
      let id; 
      // console.log(con);
      for(let i of data){
        if(i.text==con){
          id = i.id;
          break;
        }
      }
      return id;
  }

  addTextEmp(array,prop1:string,prop2:string){
        let x = []
        for(let i of array) {
            i['text'] = i.user[prop1] + ' ' + i.user[prop2];
            x.push(i);
        }
        return x;
    }

    formateFilterData(data:EmpListFilter){
        let filter = new EmpListFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

      checkEmpty(data){
        if(data!=null && data=="") return null;
        else return data;
      }

      advanceFilter(arr,filter:EmpListFilter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.firstName? this.checkUserProp(data,filter,'firstName'):true;
                  let b = filter.lastName? this.checkUserProp(data,filter,'lastName'):true;
                  let c = filter.employeeCategory? this.checkEmpProp(data,filter,'employeeCategory'):true;
                  let d = filter.email? this.checkUserProp(data,filter,'email'):true;
                  let e = filter.address? this.checkEmpProp(data,filter,'address'):true;
                  let f = filter.approved? this.checkApproved(data,filter):true;
                  
                   if(a && b && c && d && e && f) 
                    filterData.push(data);
                }
                return filterData;
            } else return arr;
      }




      checkAllNull(filter){
          for(let f in filter){
              if(filter[f]!=null) return true;
          }
          return false;
      }

      checkUserProp(data,filter,prop){
        let nam = data.user[prop].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkEmpProp(data,filter,prop){
        let nam = data[prop].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkApproved(data,filter){
        let nam:string; 
        if(data.approved) nam = ('yes').toUpperCase();
        else nam = ('no').toUpperCase();
        let fil = filter.approved.toUpperCase();
        if(nam==fil) return true;
        return false;
      }

    searchDoc(ser,arr){
        let filter = []
        if(ser!=null&&ser!=''){
          let fil = ser.toUpperCase();
          for(let data of arr) {
              let nam:string;
              if(data.hasOwnProperty('skillName')) {
                  nam = data.skillName.toUpperCase();
              } else nam = data.inductionName.toUpperCase();

              let des = data.description.toUpperCase();

              if(nam.indexOf(fil)>-1 || des.indexOf(fil)>-1) filter.push(data);
          }
          return filter;
        }
        return arr;
    }

    searchInduction(data,arr){
        let results = [];
        if(data!=""){
          for(let i of arr){
            let search = data.toUpperCase();
            let name = i.induction.name.toUpperCase();
            if(name.indexOf(search)>-1) results.push(i);
          }
          return results;
        }
        return arr;
    }

    /*********CSV***********/

    formatEmpCSV(emp){
      let data = [];
      for (let i=0; i< emp.length; i++){
        let obj = {
          "Sl No": i+1,
          "Employee Name": emp[i].user.firstName + ' ' + emp[i].user.lastName,
          "Employee Category": emp[i].employeeCategory,
          "Email": emp[i].user.email,
          "Mobile": emp[i].user.mobile,
          "DOB": this.validationForm.dateShow(emp[i].dob),
          "Address":emp[i].address.replace(/,/g , ";"),
          "Emargency Contact Name":  emp[i].emergencyContactName,
          "Emargency Contact":  emp[i].emergencyContactMobile,
          "Bank Account No": emp[i].bankAccountNo,
          "Bank Name": emp[i].bankName,
          "Bank Bsb": emp[i].bankBsb,
          "TFN": emp[i].tfnNo,
          "ABN": emp[i].abnNo,
          "Superannuation Name": emp[i].superannuationName,
          "Superannuation Number": emp[i].superannuationNo,
          "Approved": emp[i].approved
        }
        data.push(obj);
      }
      return data;
    }

    formatDocCSV(doc){
      let data = [], ind = 1;
      for (let i of doc){
        let obj = {
          "Sl No": ind++,
          "Employee Name": i.employeeName,
          "Skill Doc Name": i.skillName? i.skillName:'N/A',
          "Induction Name": i.inductionName? i.inductionName:'N/A', 
          "Attachment Name": i.documentName,
          "Expiry Date": i.expiryDate?this.validationForm.dateShow(i.expiryDate):'N/A',
          "Issue Date": i.issueDate?this.validationForm.dateShow(i.issueDate):'N/A',
          "Description": i.description.replace(/,/g,'')
        }
        data.push(obj);
      }
      return data
    }

    formatInductionCSV(indu){
      let data = [], index = 1;
      for (let i of indu){
        let obj = {
          "Sl No": index++,
          "Employee Name": i.employee.user.firstName + ' '+i.employee.user.lastName ,
          "Induction Name": i.induction.name,
          "Form Name": i.induction.form.formName
        }
        data.push(obj);
      }
      return data
    }


    

      



}
