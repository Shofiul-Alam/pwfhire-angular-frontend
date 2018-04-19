import { Injectable, NgZone } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {GLOBAL} from "../models/global";
import {EmployeeAllocation} from './../models/employeeAllocation';


@Injectable()
export class EmployeeInductionsService {
    public url:string;
    public identity;
    public token;
    private cUrl: string = '/assets/api/countries.json';

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
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



    // getSingleFillInduction(Id){
    //     let json = JSON.stringify({"id":Id});
    //     let params = "json="+json + '&authorisation='+this.getToken();
    //     let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    //     return this._http.post(this.url+'/form/get-form?XDEBUG_SESSION_START=PHPSTORM', params,{headers: headers}).map(res=>res.json());
    // }



    // saveInductionData(data, inductionId) {
    //     let json = JSON.stringify(data);
    //     let params = "json="+json +'&induction='+ inductionId + '&authorisation='+this.getToken();
    //     let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

    //     return this._http.post(this.url+'/induction/save-data?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
    //         .map(res => res.json());
    // }
    getEmployeeInductionForms() {
        let params = 'authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-induction/all?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    saveEmployeeOnlyInductionData(data, inductionId) {
        let json = JSON.stringify(data);
        let params = "json="+json +'&induction='+ inductionId + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-induction/save-data?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getEmployeeSubmittedInduction(){
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-induction/submitted-inductions?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateInductionData(data, inductionId) {
        let json = JSON.stringify(data);
        let params = "json="+json +'&induction='+ inductionId + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-induction/update-data?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }



    

}