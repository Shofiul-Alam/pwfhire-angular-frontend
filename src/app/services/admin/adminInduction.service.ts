import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {Form} from './../../models/Form';



import {AdminGLOBAL} from "./adminGlobal";


@Injectable()
export class InductionService {

    private url;
    public token;
    private form:Form;

    constructor(private _http: Http) {
        this.url = AdminGLOBAL.url;
        this.form = new Form();

        
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

    addInduction(data) {

        let json = JSON.stringify(data);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/induction/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    allInduction() {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/induction/list?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    saveInductionData(data, inductionId) {
        let json = JSON.stringify(data);
        let params = "json="+json +'&induction='+ inductionId + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/induction/save-data?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    addEmployeeInductionDoc(data, empUp) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(empUp);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-employee/add-induction-doc?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getAllSubmittedInductions() {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/induction/sumitted-inductions?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }


    /************** CSV **************/

    formatCSVData(data){
        let arr = [], index = 1;
        for(let i of data){
            let obj ={
                "SL No": index++,
                "Induction Name": i.name,
                "Form Name": i.form.formName,
                "Approved": 'Yes'
            };
            arr.push(obj);
        }
        return arr;
    }

    

    




}