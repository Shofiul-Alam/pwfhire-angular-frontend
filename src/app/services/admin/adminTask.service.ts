import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import { Task } from './../../models/task';
import { TaskFilter } from './../../models/taskFilter';
import {AdminGLOBAL} from "./adminGlobal";
import {ValidationService} from "./../formValidation.service";


@Injectable()
export class AdminTaskService {

    public url:string;
    public identity;
    public token;
    public task = new Task();


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



    // get(){
    //     let url = this.url + '.json?auth=' + this.token;
    // 	let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    // 	return this._http.get(url,{headers: headers}).map(res=>res.json());
    // }
    get() {
        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-task/list?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    getOrderTask(filter){
       let arr = JSON.stringify(filter);
       let params = "filters="+arr +'&authorisation='+this.getToken();
       let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-task/order-tasks?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json()); 
    }

    getTaskAllocation(taskId){
       let arr = JSON.stringify({"id":taskId});
       let params = "json="+arr +'&authorisation='+this.getToken();
       let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-allocation/task-allocations?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json()); 
    }
    getEmployeesForAllocation(taskId){
        let arr = JSON.stringify({"id":taskId});
        let params = "json="+arr +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-allocation/employees-for-allocations?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }


    add(order) {
        let json = JSON.stringify(order);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-task/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(task_to_update) {
        let json = JSON.stringify(task_to_update);
        let params = "json="+json +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-task/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    delete(id){
        let url = this.url +'/' + id + '.json?auth=' + this.token;
        // console.log(url);
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.delete(url,{headers: headers}).map(res=>res.json());
    }

    archiveTask(task) {
        let json = JSON.stringify(task);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-task/archive-task?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    
     addKeyArray(data){
        let newArray:any=[];
        for(let key in data) {
            data[key]['id']= key;
            newArray.push(data[key]);
        };
        return newArray;
    }

    getOrderTasks(data,id){
        let arr = [];
        for (let i of data){
            if(i.order.id==id) arr.push(i)
        }
        return arr;
    }

    findById(input, id) {

        for (var i = 0; i<input.length; i++) {
          if (input[i].id == id) {
            return input[i];
          }
        }
        return null;
    };

    convertTime(t){
        let hour = t.hour;
        let min = t.minute;
        if (hour>12){
            hour = hour - 12;
            return ((hour.toLocaleString()).length==1? '0'+hour:hour) + ":" + (min==0? '00' :min) + " PM"
        } else return ((hour.toLocaleString()).length==1? '0'+hour:hour) + ":" + (min==0? '00' :min) + " AM"
    }


    getEmpLocations(res,prop:string|number){
        let locs = [], l=0;
        for(let i of res){
          // console.log(i);
          locs.push({lat:i[prop].lattitude, lng:i[prop].longitude, label:(l++).toLocaleString(), name:i[prop].user.firstName});
        }
        return locs;
      }


    /********* Advance Filter**************/

    formateFilterData(data:TaskFilter){
        let filter = new TaskFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

      checkEmpty(data){
        if(data!=null && (data==""||data.length==0)) return null;
        else return data;
      }

      advanceFilter(arr,filter:TaskFilter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.taskName? this.checkTask(data,filter):true;
                  let b = filter.job? this.checkJob(data,filter):true;
                  let c = filter.startTime||filter.endTime? this.checkTime(data,filter):true;
                  let d = filter.startDate||filter.endDate? this.checkDate(data,filter):true;
                  
                   if(a && b && c && d) 
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

      checkTask(data,filter){
        let nam = data.taskName.toUpperCase();
        let fil = filter.taskName.toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkJob(data,filter){
        if(Array.isArray(data.job)){
            if(data.job[0].id==filter.job) return true;
        } else {
            if(data.job.id==filter.job) return true;
        }  
        return false;
      }


      checkDate(data,filter){
          let start = this.toTimestamp(filter.startDate);
          let end = this.toTimestamp(filter.endDate);
          let formDate = data.startDate.hasOwnProperty('timestamp')? data.startDate.timestamp:this.toTimestamp(data.startDate);
          let toDate = data.endDate.hasOwnProperty('timestamp')? data.endDate.timestamp:this.toTimestamp(data.endDate);

          if(filter.startDate!=null&&filter.endDate!=null){
              if(formDate>= start&& toDate<=end) return true;
              return false;

          } else if(filter.startDate!=null){
              if(formDate>= start) return true;
              return false;

          } else if(filter.endDate!=null){
              if(toDate<=end) return true;
              return false;
          }
      }

      toTimestamp(date){
        if(date!=null){
            let a = date.year +'-'+date.month+'-'+date.day;
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
      }

      checkTime(data,filter){
          let start = this.timeToTimestamp(filter.startTime);
          let end = this.timeToTimestamp(filter.endTime);
          let formTime = data.startTime.hasOwnProperty('timestamp')? data.startTime.timestamp:this.timeToTimestamp(data.startTime);
          let toTime = data.endTime.hasOwnProperty('timestamp')? data.endTime.timestamp:this.timeToTimestamp(data.endTime);

          if(filter.startTime!=null&&filter.endTime!=null){
              if(formTime>= start&& toTime<=end) return true;
              return false;

          } else if(filter.startTime!=null){
              if(formTime>= start) return true;
              return false;

          } else if(filter.endTime!=null){
              if(toTime<=end) return true;
              return false;
          }
      }

      timeToTimestamp(time){
          let a:string;
          if(time!=null){
             if(typeof time == 'string') a = '1970-01-01 ' + time;
             else a = '1970-01-01 ' + time.hour +':'+ time.minute;
             let datum = Date.parse(a);
             return datum/1000;
        } return null;
      }

    /***********CSV************/

    formatCSVData(data){
      let arr =[], index = 1;
      for(let i of data){
        let obj={
          "Sl No":index++,
          "Client": i.order.project.client.companyName,
          "Project": i.order.project.projectName,
          "Project Address": i.order.project.projectAddress.replace(/,/g,';'),
          "Order": i.order.orderTitle,
          "Task Name": i.taskName,
          "Start Date": this.validation.dateShow(i.startDate),
          "End Date": this.validation.dateShow(i.endDate),
          "Start Time": this.validation.timeShow(i.startTime),
          "End Time": this.validation.timeShow(i.endTime),
          "Position": (this.checkArray(i.job)?i.job[0].name:i.job.name)
        };
        arr.push(obj);
      }  
      return arr;
    }

    checkArray(job){
    if(Array.isArray(job)) return true;
     else return false;
  }

}