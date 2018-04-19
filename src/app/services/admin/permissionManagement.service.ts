
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {Client} from "./../../models/client";

@Injectable()
export class PermissionManagement {
    public url:string;
    public identity;
    public token;
    public client:Client = new Client();

    constructor(private _http: Http) {
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

    permitInduction(inductionPermision) {
        let inductionObj = JSON.stringify(inductionPermision);
        let params = "json="+inductionObj+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/permissions/induction-permission?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    getEmployeeInductionForms(empId,page?) {
        let params = 'empId=' + empId + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/induction/allowed-inductions?page='+ page+'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }


}


