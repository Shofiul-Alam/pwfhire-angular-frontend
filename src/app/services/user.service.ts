import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from "../models/global";

@Injectable()
export class UserService {
    public url:string;
    public identity;
    public token;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }
    signIn(user_to_login) {
        let json = JSON.stringify(user_to_login);
        let params = "json="+json;
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/login?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res=>res.json());
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
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

    logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        window.location.href = '/login';
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


