
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Admin} from "./../../models/admin";


@Injectable()
export class AdminService {
    public url:string;
    public identity;
    public token;

    private userData = new BehaviorSubject<Admin>( new Admin());
    user = this.userData.asObservable();

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

    getUser() {
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/profile?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    add(user) {
        let json = JSON.stringify(user);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update) {
        let json = JSON.stringify(usert_to_update);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateDataWithAvatar(data, avatar) {
        let json = JSON.stringify(data);
        let userAvatat = JSON.stringify(avatar);
        let params = "json="+json+"&upload="+userAvatat +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    addIdCard(data, empUp) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(empUp);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/add-id-card?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    changeUserData(data) {
        this.userData.next(data);
      }

    updatePassowrd(password) {
        let params = "password="+password+"&authorisation="+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/user/update-password?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res=>res.json());
    }
    updateEmail(email) {
        let params = "email="+email+"&authorisation="+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/user/update-email?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res=>res.json());
    }

    
}


