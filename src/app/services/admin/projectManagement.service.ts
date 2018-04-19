
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {Client} from "./../../models/client";
import {Project} from "./../../models/project";
import { Contact } from './../../models/contact';
import {AllocatedInduction} from "../../models/allocatedInduction";
import {AllocatedContact} from "../../models/allocatedContact";
import {ProjectFilter} from "../../models/projectFilter";



@Injectable()
export class ProjectManagement {
    public url:string;
    public identity;
    public token;
    public client:Client = new Client();
    public project:Project = new Project();

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

    add(project) {
        let json = JSON.stringify(project);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-project/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update) {
        let json = JSON.stringify(usert_to_update);
        let params = "json="+json +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-project/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    allProject(page?) {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-project/list?page='+ page +'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    archiveProject(project) {
        let json = JSON.stringify(project);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-project/archive-project?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
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

    getClientProjects(clientId) {
        let params = "clientId="+clientId +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-project/client-projects?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getProjectDocument(){
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        // return this._http.post(this.url+'/admin/profile?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());

        return this._http.get('./assets/api/proDoc.json').map(res => res.json());
    }

    getProjects(data,id){ 
        let arr:Array<any> = [];
        for (let i of data) {
            if(i.client.id == id) arr.push(i);
        }
        return arr;
    }

    getInduction(arr, idArr){
        let induc = [];
        for(let i of arr){
            for(let x of idArr){
                if(i.id==x){
                   induc.push(i);
                   idArr.splice(idArr.indexOf(x),1);
                   break;
                }
            }
            
        }
        return induc;
    }

    getIds(arr:any[],con:string){
        let id = [];
        for(let i of arr){
           if(i.hasOwnProperty(con)) id.push(i[con].id);
           else id.push(i.id);
        }
        return id;
    }

    addAllocatedInduction(data,allocated,prop:string):Array<AllocatedInduction>{
        let alocInductions: Array<AllocatedInduction> = [];
        for (var i=0; i < data.length; i++) {
            let alo = new AllocatedInduction();
            alo.id = this.findAlloctedId(data[i],allocated,prop);
            alo.induction.id = data[i];
            alo.project = null;
            alocInductions.push(alo);
        }
        return alocInductions;
    }

    addAllocatedContact(data,allocated,prop:string):Array<AllocatedContact>{
        let alocContacts: Array<AllocatedContact> = [];
        for (var i=0; i < data.length; i++) {
            let alo = new AllocatedContact();
            alo.id = this.findAlloctedId(data[i],allocated,prop);
            alo.contact.id = data[i];
            alo.client = null;
            alo.order = null;
            alo.project = null;
            alocContacts.push(alo);
        }
        
        return alocContacts;
    }

    findAlloctedId(id,allocated,prop:string):string {
        let x = '0';
        for(var i=0; i < allocated.length; i++) {
            if(allocated[i][prop].id == id) {
                x = allocated[i].id;
            }
        }
        return x;
    }

    findById(input, id) {
        for (var i = 0; i<input.length; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    };

    contactList(allocatedContact):Array<Contact>{
        let conArr = [];
        for(var i = 0; i < allocatedContact.length; i++ ) {
            let cont = new Contact();
            cont.text = allocatedContact[i].contact.text;
            cont.id = allocatedContact[i].contact.id;
            conArr.push(cont);
        }

        return conArr;
    }

    addAllocatedContactClient(con):AllocatedContact{
        let allocatedCon = new AllocatedContact();
        allocatedCon.id = '0';
        allocatedCon.contact = con;
        allocatedCon.client = null;
        allocatedCon.project = null;
        allocatedCon.order = null;
        return allocatedCon;
    }

    findProperDetails(f,arr){
        let ind;
        for(let x of arr){
          if(f.induction.id==x.id){
            ind = x;
            break;
          }
        }
        return ind;
    }

    getContactname(id,allocatedContact){
        for(let x of allocatedContact){
          if(id==x.contact.id){
            return x.contact.emargencyContact;
          }
        }
        return '';
    }

    addText(array,prop:string){
        let x = []
        for(let i of array) {
            i['text'] = i[prop];
            x.push(i);
        }
        return x;
    }

    formateFilterData(data:ProjectFilter){
        let filter = new ProjectFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

      checkEmpty(data){
        if(data!=null && data=="") return null;
        else return data;
      }

      advanceFilter(arr,filter:ProjectFilter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.client? this.checkClient(data,filter):true;
                  let b = filter.projectName? this.checkPro(data,filter,'projectName'):true;
                  let c = filter.projectAddress? this.checkPro(data,filter,'projectAddress'):true;
                  let d = filter.before? this.checkBefore(data,filter):true;
                  let e = filter.after? this.checkAfter(data,filter):true;
                  
                   if(a && b && c && d && e) 
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

      checkPro(data,filter,prop){
        let nam = data[prop].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkClient(data,filter){
        if(data.client.id==filter.client) return true;
        return false;
      }


      checkBefore(data,filter){
          let start = this.toTimestamp(filter.startDate);
          // if(data.date.timestamp<= start) return true;
          // return false;
      }

      checkAfter(data,filter){
          let start = this.toTimestamp(filter.startDate);
          // if(data.date.timestamp>= start) return true;
          // return false;
      }

      toTimestamp(date){
        if(date!=null){
            let a = date.year +'-'+date.month+'-'+date.day;
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
      }

    /************CSV****************/

    formatCSVData(data){
        let arr = [];
        let index = 1;
        for(let i of data){
            let obj = {
                "SL No": index++,
                "Client": i.client.companyName,
                "Project Name": i.projectName,
                "Project Address": i.projectAddress.replace(/,/g , ";"),
                "Modified By": '',
                "Modified Time": '',
                "Contact": this.contactString(i.allocatedContact),
                "Induction": this.inductionString(i.allocatedInduction)
            };
            arr.push(obj);
        }
        return arr
    }

    private contactString(data){
        let con = '';
        for(let c of data){
            con += c.contact.emargencyContact + ';';
        }
        return con.slice(0, -1);
    }

    private inductionString(data){
        let ind = '';
        for(let i of data){
            ind += i.induction.name + ';';
        }
        return ind.slice(0, -1);
    }

      

}


