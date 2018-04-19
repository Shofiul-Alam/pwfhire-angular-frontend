
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {Client} from "./../../models/client";
import {ClientFilter} from "./../../models/clientFilter";
import { ValidationService } from './../formValidation.service';



@Injectable()
export class ClientManagment {
    public url:string;
    public identity;
    public token;
    public client:Client = new Client();

    constructor(private _http: Http, private validation:ValidationService) {
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

        return this._http.post(this.url+'/user/profile?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    add(client) {
        let json = JSON.stringify(client);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    addDataWithAvatar(client, avatar) {
        let json = JSON.stringify(client);
        let avat = JSON.stringify(avatar);
        let params = "json="+json + "&upload="+ avat + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(client) {
        let json = JSON.stringify(client);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    updateDataWithAvatar(usert_to_update,avatar) {
        let json = JSON.stringify(usert_to_update);
        let avat = JSON.stringify(avatar);
        let params = "json="+json + "&upload="+ avat + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    allClient(page?) {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/list?page='+ page +'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    allClientList() {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/list?&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
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
    getContacts(client){
        let json = JSON.stringify(client);
        let params = "json="+json+'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/contacts?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    isArchive(client) {
        let json = JSON.stringify(client);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-client/archive-client?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    /********* Advance Filter**************/

    formateFilterData(data:ClientFilter){
        let filter = new ClientFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

      checkEmpty(data){
        if(data!=null && (data==""||data.length==0)) return null;
        else return data;
      }

      advanceFilter(arr,filter:ClientFilter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.companyName? this.checkClientProp(data,filter,'companyName'):true;
                  let b = filter.companyAbnNo? this.checkClientProp(data,filter,'companyAbnNo'):true;
                  let c = filter.email? this.checkEmail(data,filter):true;
                  let d = filter.companyAcn? this.checkClientProp(data,filter,'companyAcn'):true;
                  let e = filter.companyTfn? this.checkClientProp(data,filter,'companyTfn'):true;
                  let f = filter.landlineNo? this.checkClientProp(data,filter,'landlineNo'):true;
                  let g = filter.allocatedContact? this.checkClientContact(data,filter):true;
                  
                   if(a && b && c && d && e && f && g) 
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

      checkEmail(data,filter){
        let nam = data.user.email.toUpperCase();
        let fil = filter.email.toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkClientProp(data,filter,prop){
        let nam = data[prop].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkClientContact(data,filter){
         let c = 0;
        for(let con of data.allocatedContact){
            if(filter.allocatedContact.includes(con.contact.id)){
                c ++;
                if(c==filter.allocatedContact.length) return true;
            }
        }
        return false;
      }

    /* **************CSV ***************/
      
    formatCSVData(data){
        let arr = [];
        let index = 1;
        for(let i of data){
           let obj = {
               "SL No": index++,
               "Company Name": i.companyName,
               "Company ABN": i.companyAbnNo,
               "Land Phone": i.landlineNo,
               "Mobile": i.mobileNo,
               "Account Payable No": i.accountPayableNo,
               "Account Payable Email": i.accountPayableEmail,
               "Invoice Date": this.validation.dateShow(i.invoiceDueDate),
               "Charge Rate": i.chargeRates 
           };
           arr.push(obj);
        }
        return arr;
    }
   
}


