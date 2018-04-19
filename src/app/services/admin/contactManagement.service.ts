
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {Client} from "./../../models/client";
import {Contact} from "./../../models/contact";

@Injectable()
export class ContactManagment {
    public url:string;
    public identity;
    public token;
    colNum;

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

    add(contact, clientObj) {
        let json = JSON.stringify(contact);
        let client = JSON.stringify(clientObj);
        let params = "json="+json + "&client=" + client + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-contact/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update) {
        let json = JSON.stringify(usert_to_update);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/admin/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    allContact() {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-contact/list?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    addIdCard(data, empUp) {
        let json = JSON.stringify(data);
        let empUpload = JSON.stringify(empUp);
        let params = "json="+json+"&upload="+empUpload +'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/add-id-card?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    colorContact(i){
        return {'btn-primary':i==0||i==5||i==10||i==15||i==20,
                'btn-warning':i==1||i==6||i==11||i==16||i==21,
                'btn-inverse':i==2||i==7||i==12||i==17||i==22,
                'btn-info':i==3||i==8||i==13||i==18||i==23,
                'btn-danger':i==4||i==9||i==14||i==19||i==24,
                'btn-default': i>24 
            }
    }
    
    getSelectedCon(data){ 
        let arr:Array<any> = [];
        for (let i of data) {
            arr.push(i.contact);
        }
        return arr;
    }



}


