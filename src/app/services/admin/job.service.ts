import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {AdminGLOBAL} from "./adminGlobal";

@Injectable()
export class JobService {
    public url:string;
    public token;

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

    getJobs(page?:number) {
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/list?page='+ page, params, {headers: headers}).map(res => res.json());
    }

    getJobList() {
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/list', params, {headers: headers}).map(res => res.json());
    }

    addJob(job) {
        let json = JSON.stringify(job);
        let params = "json="+json+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateJob(category) {
        let json = JSON.stringify(category);
        let params = "json="+json + '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/edit', params, {headers: headers})
            .map(res => res.json());
    }
    delete(data) {
        let json = JSON.stringify(data);
        let params = "json="+json+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/archive-job?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }
    archiveJob(data) {
        let json = JSON.stringify(data);
        let params = "json="+json+'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-job/archive-job?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    findById(input, id) {

        for (var i = 0; i<input.length; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    };

    getMultiSelectData(arr,data){
        let x = [];
        for(var i=0; i < data.value.length; i++) {
            let con = this.findById(arr, data.value[i]);
            if(x.indexOf(con)) x.push(con);
        }
        return x;
    }

    findId(arr) {
        let ids = [];
        for(let i of arr){
          ids.push(i.id);
        }
        return ids;
    };

    searchJob(f,arr){
        let result = [];
        if(f!=''){
            for(let job of arr){
                let fil, nam;
                if(isNaN(f)) {
                    fil = f.toUpperCase();
                    nam = job.name.toUpperCase();

                    if(nam.includes(fil)) result.push(job);  
                
                } else if(job.chargeRate.includes(f)||job.payscale.includes(f))
                        result.push(job);  
            }
            return result;
        }
        return arr;
    }

    /*********CSV************/

    formatCSVData(data){
        let arr = [], index = 1;
        for(let i of data){
            let obj={
                "Sl No": index++,
                "Postion": i.name,
                "Charge Rate": i.chargeRate,
                "Pay Scale": i.payscale,
                "Skills": this.skillFormatData(i.skillCompetencyList)
            };
            arr.push(obj);
        }
        return arr;
    }

    private skillFormatData(data){
        let skill = '';
        for(let s of data){
            skill += s.name+'; ';
        }
        return skill.slice(0,-2);
    }

    
}