import { Injectable, NgZone } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import {GLOBAL} from "../models/global";
import {EmployeeAllocation} from './../models/employeeAllocation';
import {EmpAllocationFilter} from './../models/empAllocationFilter';


@Injectable()
export class AllocationService {
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

    getEmployeeAllocations() {
        let params = 'authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-allocations/all?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }
    getPendingEmployeeAllocations() {
        let params = 'authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-allocations/pending?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }
    getAcceptedEmployeeAllocations() {
        let params = 'authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-allocations/accepted?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    acceptEmployeeAllocations(alloc) {
        let json = JSON.stringify(alloc);
        let params = 'json='+ json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-allocations/accept-allocation?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    denyEmployeeAllocations(alloc) {
        let json = JSON.stringify(alloc);
        let params = 'json='+ json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        
        return this._http.post(this.url+'/employee-allocations/deny-allocation?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }




    formateSendingData(data){
        let sendData = JSON.parse(JSON.stringify(data));
        let epmAllocation = new EmployeeAllocation();
        epmAllocation.employee =null;
        epmAllocation.task = null;
        epmAllocation.id = sendData.employeeAllocation.id;
        sendData.employeeAllocation = epmAllocation;
        return sendData;
    }

    formateFilterData(data:EmpAllocationFilter){
        let filter = new EmpAllocationFilter();
        filter.job = this.checkEmpty(data.job);
        filter.client = this.checkEmpty(data.client);
        filter.address = this.checkEmpty(data.address);
        filter.startDate = this.checkEmpty(data.startDate);
        filter.endDate = this.checkEmpty(data.endDate);
        return filter;
      }

      checkEmpty(data){
        if(data!=null && data=="") return null;
        else return data;
      }

      advanceFilter(arr,filter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.job? this.checkJob(data,filter):true;
                  let b = filter.client? this.checkClient(data,filter):true;
                  let c = filter.address? this.checkAddress(data,filter):true;
                  let d = filter.startDate||filter.endDate? this.checkDate(data,filter):true;

                   if(a && b && c && d) 
                    filterData.push(data);
                }
                return filterData;
            } else return arr;
      }




      checkAllNull(f){
          if(f.job || f.client || f.address || f.startDate || f.endDate) return true;
          else return false;
      }

      checkJob(data,filter){
        if(filter.job!=null){
            let job = data.employeeAllocation.task.job[0].name.toUpperCase();
            let fil = filter.job.toUpperCase();
            if(job.indexOf(fil) > -1) return true;
        }
        return false;
      }

      checkClient(data,filter){
        if(filter.client!=null){
            let nam = data.employeeAllocation.task.order.project.client.companyName.toUpperCase();
            let fil = filter.client.toUpperCase();
            if(nam.indexOf(fil) > -1) return true;
        }
        return false;
      }

      checkAddress(data,filter){
        if(filter.address!=null){
            let nam = data.employeeAllocation.task.order.project.projectAddress.toUpperCase();
            let fil = filter.address.toUpperCase();
            if(nam.indexOf(fil) > -1) return true;
        }
        return false;
      }

      checkDate(data,filter){
          let start = this.toTimestamp(filter.startDate);
          let end = this.toTimestamp(filter.endDate);

          if(filter.startDate!=null&&filter.endDate!=null){
              if(data.date.timestamp>= start&& data.date.timestamp<=end) return true;
              return false;

          } else if(filter.startDate!=null){
              if(data.date.timestamp>= start) return true;
              return false;

          } else if(filter.endDate!=null){
              if(data.date.timestamp<=end) return true;
              return false;

          }else return false;
      }

      toTimestamp(date){
        if(date!=null){
            let a = date.year +'-'+date.month+'-'+date.day;
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
      }




    

    

}