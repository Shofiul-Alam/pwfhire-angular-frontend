
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {Client} from "./../../models/client";

@Injectable()
export class IntegrationManagement {
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

    /** Section Twilio Configuration **/

    setTwilioConfig(configArr) {
        let twilioConfig = JSON.stringify(configArr);
        let params = "json="+twilioConfig+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-integration/integrate-twilio?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }
    getTwilioConfig() {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-integration/twilio-config?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    updateTwilioConfig(configArr) {
        let twilioConfig = JSON.stringify(configArr);
        let params = "json="+twilioConfig+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-integration/update-twilio-config?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }






}


