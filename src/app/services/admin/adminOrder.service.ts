import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import { Order } from './../../models/order';
import { OrderFilter } from './../../models/orderFilter';
import {AdminGLOBAL} from "./adminGlobal";
import {ValidationService} from "./../formValidation.service";



@Injectable()
export class AdminOrderService {
    public url:string;
    public identity;
    public token;
    public order:Order;


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

    add(order) {
        let json = JSON.stringify(order);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-order/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    update(usert_to_update) {
        let json = JSON.stringify(usert_to_update);
        let params = "json="+json +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-order/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }
    allOrder(page?) {
        let params = 'authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-order/list?page='+ page +'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getProjectOrders(filter) {
        let arr = JSON.stringify(filter);
        let params = "filters="+arr +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-order/project-orders?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    delete(id){
        let url = this.url +'/' + id + '.json?auth=' + this.token;
        // console.log(url);
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.delete(url,{headers: headers}).map(res=>res.json());
    }

    archiveOrder(order) {
        let json = JSON.stringify(order);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-order/archive-order?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }




    // getProjectOrders(data,id){
    //     let arr = [];
    //     for (let i of data){
    //         if(i.project.id==id) arr.push(i)
    //     }
    //     return arr;
    // }


    get(){
        let url = this.url + '.json?auth=' + this.token;
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    	return this._http.get(url,{headers: headers}).map(res=>res.json());
    }

    findById(input, id) {

    for (var i = 0; i<input.length; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  };

  /********* Advance Filter**************/

    formateFilterData(data:OrderFilter){
        let filter = new OrderFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

      checkEmpty(data){
        if(data!=null && (data==""||data.length==0)) return null;
        else return data;
      }

      advanceFilter(arr,filter:OrderFilter){
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let data of arr){
                  let a = filter.orderTitle? this.checkOrder(data,filter,'orderTitle'):true;
                  let b = filter.owner? this.checkOrder(data,filter,'owner'):true;
                  let c = filter.orderStatus? this.checkOrder(data,filter,'orderStatus'):true;
                  let d = filter.comments? this.checkOrder(data,filter,'comments'):true;
                  let e = filter.client? this.checkClient(data,filter):true;
                  let f = filter.project? this.checkProject(data,filter,'project'):true;
                  let g = filter.projectAddress? this.checkProject(data,filter,'projectAddress'):true;
                  let h = filter.startDate||filter.endDate? this.checkDate(data,filter):true;
                  
                   if(a && b && c && d && e && f && g && h) 
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

      checkOrder(data,filter,prop){
        let nam = data[prop].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
        return false;
      }

      checkClient(data,filter){
        if(data.project.client.id==filter.client) return true;
        return false;
      }

      checkProject(data,filter,prop){
        let p = prop=='project'? 'id': prop;
        let nam = data.project[p].toUpperCase();
        let fil = filter[prop].toUpperCase();
        if(nam.indexOf(fil) > -1) return true;
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

          }else return false;
      }

      toTimestamp(date){
        if(date!=null){
            let a = date.year +'-'+date.month+'-'+date.day;
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
      }

    /**************CSV***************/

    formatCSVData(data){
      let arr = [];
      let index = 1;
      for(let i of data){
        let obj= {
          "SL No":index++,
          "Client": i.project.client.companyName,
          "Project": i.project.projectName,
          "Project Address": i.project.projectAddress.replace(/,/g,';'),
          "Order": i.orderTitle,
          "Order Description": i.orderDescription? i.orderDescription.replace(/,/g,';'):'',
          "Status": i.orderStatus,
          "Satrt Date": this.validation.dateShow(i.startDate),
          "End Date": this.validation.dateShow(i.endDate),
          "Owner": i.owner,
          "last Update": '',
          "Created On": '',
          "Comment": i.comments? i.comments.replace(/,/g,';'):''
        };
        arr.push(obj);
      }
      return arr;
    }

}