
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from "../models/global";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Employee} from "./../models/employee";


@Injectable()
export class EmployeeService {
    public url:string;
    public identity;
    public token;
    private cUrl: string = './assets/api/countries.json';

    private userData = new BehaviorSubject<Employee>( new Employee());
    user = this.userData.asObservable();

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    changeUserData(data) {
        this.userData.next(data);
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

    getUser() {
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/user/profile?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    register(user_to_register) {
        let json = JSON.stringify(user_to_register);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee/new?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
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

        return this._http.post(this.url+'/employee/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getCounrt(){
        return this._http.get(this.cUrl).map(res => res.json());
    }

    getCountryFromSelect(arr,f){
        for(let i of arr){
            if(i.id===f) return i.text;
        }
        return;
    }
    checkCountry(data,con){
      let id;
      for(let i of data){
        if(i.text==con){
          id = i.id;
          break;
        }
      }
      return id;
    }

}


