
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from "../models/global";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Client} from "./../models/client";


@Injectable()
export class ClientService {
    public url:string;
    public identity;
    public token;

    private userData = new BehaviorSubject<Client>( new Client());
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
        let params = "json="+json;
        // console.log(params);
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/client/new?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update,avatar) {
        let json = JSON.stringify(usert_to_update);
        let avat = JSON.stringify(avatar);
        let params = "json="+json + "&upload="+ avat + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/client/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    addIdCard(data, empUp) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(empUp);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/client/add-id-card?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

}


