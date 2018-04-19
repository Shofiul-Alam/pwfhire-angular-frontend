import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./../../services/admin/adminGlobal";

@Injectable ()
export class StarterService{
    private url:string;
    private identity;
    private token;

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
    getlineonedata (url){
        return this._http.get(url)
            .map((response: Response) => response.json())
    }

    getApplicationUsers (){
        let params = '&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/application-user/list?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    
   
    getEmployeeCount(arr){
        if (arr) {
            for(let o of arr){
                if(o.user=='Employee')
                return o.totalCount;
            }
            return 0;
        }
    }

    proccesDoughnut(user){
        if (user) {
            let arr = [];
            for(let o of user){
                arr.push({label:o.user,data:o.totalCount});
            }
            return arr;
        }
    }

    getLabelData(arr){
        let a = arr;
        let b;
        let label=[];
        let data=[];
        for (let i= 0; i< a.length; i++){
            label.push(a[i].label);
            data.push(a[i].data);
        }
        return b={
            'lab':label,
            'dat': data
        }
    }
    getTotal (arr){
        let a = arr;
        let b = 0;
        for (let i= 0; i< a.length; i++){
            b += a[i];
        }
        return b;
    }
    getPercentage (arr,j){
        let a = arr;
        let b:number[]=[];
        for (let i= 0; i< a.length; i++){
            let t = Number(((a[i]/j)*100).toFixed(1));
            b.push(t);
        }
        return b;
    }

    makeYearObject(dates){
        let obj = {}, year=[];
        for(let d of dates){
            let y = new Date(d).getFullYear();
            y.toLocaleString();
            if(year.includes(y)){
               obj[y].push(d); 
            } else {
                obj[y] = [];
                obj[y].push(d);
                year.push(y)
            }
        }
        return obj;
    }

    makeMonthObject(data,year){
        let obj = {}, month=[];
        let mL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        if(data[year]){
            for(let d of data[year]){
               let m = new Date(d).getMonth();
               let num =  mL[m];
                if(month.includes(num)){
                   obj[num].push(d); 
                } else {
                    obj[num] = [];
                    obj[num].push(d);
                    month.push(num)
                } 
            } 
        }
        return obj;
    }

    makeAllocationChartData(data){
        let mL =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let arr = [], month =[];
        for(let i of mL){
            for(let m in data){
                if(m==i){
                    arr.push({label:m,data:data[m].length});
                    month.push(i)
                    break;
                }
            }
            if(!month.includes(i)) {
                arr.push({label:i,data:0});
                month.push(i);
            }
        }
        return arr;
    }

    makeWeekObject(data,month,year){
        if(month){
            let arr = [];
            let mData = data[month]
            let w = this.getWeekRange(mData,month,year);
            for(let i of w){
              arr.push({label:i['week'],data:i['date'].length});  
            }
            return arr;
        }    
        return data;
    }

    getWeekRange(data,month,year){
        if(data){
            let week = [];
            let a = new Date(data[0]);
            let firstOfMonth = new Date(a.getFullYear(), a.getMonth(), 1);
            let lastOfMonth = new Date(a.getFullYear(), a.getMonth()+1, 0,23,59);
            let f = firstOfMonth.getDate();
            let l = lastOfMonth.getDate();
            let newArr = data.map((t)=>{
                return new Date(t).getDate();
            })
            let range = [];
            for(f;f<=l;f++){
                let d =  new Date(a.getFullYear(), a.getMonth(),f).getDay();
                if(d==0) range.push(f);            
            }

            if(range[0]==1){
                let obj ={};
                obj['week'] = 'week1';
                obj['date'] = newArr.filter((d)=>{
                    return d>=range[0] && d<range[1];
                });
                week.push(obj);
                let len = range.length;
                for(let i=1;i<len-1;i++){
                    let newObj = {}
                    newObj['week'] = 'week' + (i+1);
                    newObj['date'] =  newArr.filter((d)=>{
                        return d>=range[i] && d<range[i+1];
                    });
                    week.push(newObj);
                }
                let o ={};
                o['week'] = 'week' + (len);
                o['date'] = newArr.filter((d)=>{
                    return d>=range[len-1];
                });
                week.push(o);
            } else {
                let obj ={};
                obj['week'] = 'week1';
                obj['date'] = newArr.filter((d)=>{
                    return d>=f && d<range[0];
                });
                week.push(obj);
                let len = range.length;
                for(let i=0;i<len-1;i++){
                    let newObj = {}
                    newObj['week'] = 'week' + (i+2);
                    newObj['date'] =  newArr.filter((d)=>{
                        return d>=range[i] && d<range[i+1];
                    });
                    week.push(newObj);
                }
                let o ={};
                o['week'] = 'week' + (len+1);
                o['date'] = newArr.filter((d)=>{
                    return d>=range[len-1];
                });
                week.push(o);
            }
            
            return week;
        } else{
           let mL =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
           let index = mL.indexOf(month); 
           let f = new Date( 1).getDate();
           let l = new Date(year, index+1, 0,23,59).getDate();
           let week =[];
           let c = 0;
           for(f;f<=l;f++){
                let d =  new Date(year, index,f).getDay();
                if(d==0) {
                    c++;
                    week.push({week:'week'+c,date:[]}); 
                }           
            }
            return week;
        }
    }

    getTotalMonthAlloc(data){
        let mL =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let a = new Date().getMonth();
        let m = data[mL[a]].length;
        let w = this.getCurrentWeek(data,mL);
        return {month:m,week:w}
    }

    getCurrentWeek(data,month){
        let nowDate = new Date();
        let day = nowDate.getDay(); 
        let first = nowDate.getTime()-(86400000*day); 
        let last = first + (86400000*6);
        let fm = new Date(first).getMonth();
        let lm = new Date(last).getMonth();
        let arr = [];
        if(fm==lm) arr = data[month[fm]];
        else {
            arr = data[month[fm]].concat(data[month[lm]]);
        } 

        let newArr = arr.filter((a)=>{
            let d = new Date(a).getTime();
            return (d>=first && d<=last)   
        });
        return newArr.length;
    }



}