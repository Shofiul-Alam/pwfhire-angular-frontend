
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {AdminGLOBAL} from "./adminGlobal";
import {EmployeeAllocation} from "./../../models/employeeAllocation";
import {EmpAlloFilter} from "./../../models/empAlloFilter";

@Injectable()
export class AllocationManagement {
    public url:string;
    public identity;
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


    sendAllocations(data, taskId) {
        let json = JSON.stringify(data);
        let params = "json="+json + "&taskId="+ taskId + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-allocation/send-allocations?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    getEmployeeAllocations(page){

        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-allocation/list?page='+page+'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());

        // return this._http.get('./assets/api/allocation.json')
        //     .map((response: Response) => response.json())
    }

    findEmployeeBookedDatesWithDoc(id, startDate, endDate) {
        let obj = {
                    'id':id,
                    'startDate': startDate,
                    'endDate': endDate
                    };
        let json = JSON.stringify(obj);
        let params = 'json='+json+'&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-allocation/doc_with_booked_in_dates?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());

    }


    /*************Advance Filter**************/


    advanceFilter(data,filter,check:boolean){
        let filterData = [];
        if(check){
            for(let emp of data){
                let a = filter.lastName? this.checkName(emp.employee,filter):true;
                let b = filter.skillCompetencyList? this.checkSkillId(emp.employee,filter):true;
                let c = filter.ratting? this.checkRatting(emp.employee,filter):true;
                if(a&&b&&c) 
                    filterData.push(emp);
            }
        } else {
            for(let emp of data){
                let a = filter.lastName? this.checkName(emp,filter):true;
                let b = filter.skillCompetencyList? this.checkSkillId(emp,filter):true;
                let c = filter.ratting? this.checkRatting(emp,filter):true;
                if(a&&b&&c) 
                    filterData.push(emp);
            }
        }
        return filterData;
    }

    checkRatting(data,filter){
        if(filter.ratting!=null){
            
        }
        return false;
    }

    checkName(data,filter){
        if(filter.lastName!=null){
            let name = data.user.lastName.toUpperCase();
            let fil = filter.lastName.toUpperCase();
            if(name.indexOf(fil) > -1) return true;
        }
        return false;
    }

    checkSkillId(data,filter){
        if(filter.skillCompetencyList!=null){
            for(let s of filter.skillCompetencyList){
                for(let d of data.employeeSkillCompentency){
                    if(d.skillId==s.id) return true;
                }
            } 
        }    
        return false;
    }

    makeempIdArray(data){
        let ids = [];
        for(let i of data){
            ids.push(i.employee.id);
        }
        return ids;
    }

    getEmployeeAllocationId(id){
        let allo = new EmployeeAllocation()
        for(let a in allo){
            if(a=='id') allo.id = id;
            else delete allo[a];
        }
        return allo;
    }


    /**************Convert Allocated Object***********/

    makeEmployeeAllocation(data){
        let arr=[], emp=[];
        for(let d of data){
            if(emp.length<1){
                let obj = {employee:{}, allocatedDates:[]};
                obj['employee'] = d.employee;
                for(let i of d.allocatedDates){
                    i['task'] = d.task;
                    obj['allocatedDates'].push(i);
                }
                arr.push(obj);
                emp.push(d.employee.id);
            } else {
                if(emp.includes(d.employee.id)){
                    let index = emp.indexOf(d.employee.id);
                    let obj = arr[index];
                    for(let i of d.allocatedDates){
                        i['task'] = d.task;
                        obj['allocatedDates'].push(i);
                    }
                } else {
                    let obj = {employee:{}, allocatedDates:[]};
                    obj['employee'] = d.employee;
                    for(let i of d.allocatedDates){
                        i['task'] = d.task;
                        obj['allocatedDates'].push(i);
                    }
                    arr.push(obj);
                    emp.push(d.employee.id);
                }
            }
        }
        return arr;
    }

    getPresentDateAllocationList(date,arr){
        let data = [];
        let x = new Date(date.last.year , (date.last.month-1) , date.last.day,0,0).getTime();
        let y = new Date(date.next.year , (date.next.month-1) , date.next.day,11,59).getTime();
        for(let d of arr){
            let obj = {employee:d.employee, allocatedDates:[]};
            for(let a of d.allocatedDates){
                let alloD = new Date(a.date.timestamp*1000).getTime();
                if(alloD>=x && alloD<=y) obj['allocatedDates'].push(a);
            }
            if(obj['allocatedDates'].length>0) data.push(obj);
        }
        return data;
    } 

    /***************Employee Allocation filter**************/

    formateFilterData(data:EmpAlloFilter){
        let filter = new EmpAlloFilter();
        for(let f in data){
            filter[f] = this.checkEmpty(data[f]);
        } 
        return filter;
      }

    private checkEmpty(data){
        if(data!=null && data=="") return null;
        else return data;
    }

    advanceEmpAlloFilter(arr,filter,date){
        if(filter.sort) this.sortingWorker(arr,filter);
        let filterData = [];
        let check = this.checkAllNull(filter);
            if(check){
                for(let d of arr){
                    let obj = {employee:d.employee, allocatedDates:[]}
                    for(let data of d.allocatedDates){
                      let a = filter.client? this.checkClient(data,filter.client):true;
                      let b = filter.project? this.checkProject(data,filter.project):true;
                      let c = filter.order? this.checkOrder(data,filter.order):true;
                      let d = filter.task? this.checkTask(data,filter.task):true;
                      
                       if(a && b && c && d ) obj['allocatedDates'].push(data);
                    }

                    if(obj['allocatedDates'].length>0) filterData.push(obj);
                }
                return this.getPresentDateAllocationList(date,filterData);
            } else return this.getPresentDateAllocationList(date,arr);
    }

    private checkClient(d,f){
        if(d.task.order.project.client.id==f) return true;
        return false;
    }

    private checkProject(d,f){
        if(d.task.order.project.id==f) return true;
        return false;
    }

    private checkOrder(d,f){
        if(d.task.order.id==f) return true;
        return false;
    }

    private checkTask(d,f){
        if(d.task.id==f) return true;
        return false;
    }

    private checkAllNull(filter){
          for(let f in filter){
              if(filter[f]!=null) return true;
          }
          return false;
      }

    private sortingWorker(data,filter){
        let asc = filter.sort == 'Ascending'? true:false;
        data.sort((a,b)=>{
            let numA = a['employee'].user.firstName.toLowerCase(), numB= b['employee'].user.firstName.toLowerCase();
            if(asc){
                if(numA<numB) return -1
                if(numA>numB) return 1
                return 0
            } else {
                if(numA<numB) return 1
                if(numA>numB) return -1
                return 0
            }
        });
    }



}


