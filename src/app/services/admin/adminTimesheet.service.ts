import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import { ValidationService } from './../formValidation.service';
import { AdminTimesheetFilter } from './../../models/timesheetManagementFilter';

import {AdminGLOBAL} from "./adminGlobal";


interface CSVData{
  employee: {},
  totalTime:number;
  jobDates: Array<JobDates>
}

interface JobDates{
  date: {},
  totalTime: number
}


@Injectable()
export class AdminTimesheetService {

    public url:string;
    public identity;
    public token;


    constructor(private _http: Http,private validationForm:ValidationService) {
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

    getTimesheet(page?) {
        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/manage-timesheet/list?page='+page+'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    getEmployeeAllocations(){
        return this._http.get('./assets/api/allocation.json')
            .map((response: Response) => response.json())
    }



    
    addTimesheet(sheet,sheetUpload) {
        let json = JSON.stringify(sheet);
        let params = "json="+json +"&upload="+ sheetUpload +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-timesheet/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateTimesheet(sheet,sheetUpload) {
        let json = JSON.stringify(sheet);
        let params = "json="+json +"&upload="+ sheetUpload +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-timesheet/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    archiveTimesheet(sheet) {
        let json = JSON.stringify(sheet);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/manage-timesheet/archive?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }


    findbyId(arr,id){
      if(id){
        let data = JSON.parse(JSON.stringify(arr));
        let value = data.find((a)=>{
          return a.id == id;
        });
        delete value.text;
        return value;
      } return null
    }





   /*************Print Timesheet**************/

    convertTimesheetData(d){
        let data = JSON.parse(JSON.stringify(d));
        data.date = this.validationForm.dateShow(d.date);
        data.startTime = this.validationForm.timeShow(d.startTime); 
        data.finishTime = this.validationForm.timeShow(d.finishTime); 
        data.allocatedDates = !d.allocatedDates? '':this.validationForm.dateShow(d.allocatedDates.date);
        return data;
    }

    printTimesheet(data){

      if(data.approved) data.approved = 'checked';
      else data.approved = '';

      console.log(data);

      let form = 
            `<form class="floating-labels" role="form" #registerForm="ngForm">
              <div class="row">
                <div class="form-group focused col-md-6">
                  <label>Empolyee</label>
                  <input class="form-control" value='${data.employee.user.firstName} ${data.employee.user.lastName}'>
                </div>
                <div class="form-group focused col-md-6">
                  <label>Allocated Date</label>
                  <input class="form-control" value='${data.allocatedDates}'>     
                </div>
              </div>
              <div class="row">
                <div class="form-group focused col-md-6">
                  <label>Selected Date</label>
                  <input class="form-control" value='${data.date}'>     
                </div>
                <div class="form-group focused col-md-6">
                  <label>Total Working hours</label>
                  <input type="text" class="form-control" value='${data.hoursWorked}'>
                </div>
              </div>
              <h5 class="m-b-15">Work Hour</h5>
              <div class="row">
                <div class="form-group focused col-md-6">
                  <label>Start Time</label>
                  <input class="form-control" value='${data.startTime}'>     
                </div>
                <div class="form-group focused col-md-6">
                  <label>End Time</label>
                  <input class="form-control" value='${data.finishTime}'>
                </div>
              </div>
              <div class="row">
                <div class="form-group focused col-md-6">
                  <label>Weekend</label>
                  <input class="form-control" value='${data.weekend}'>     
                </div>
                <div class="form-group focused col-md-6">
                  <label>Overtime</label>
                  <input class="form-control" value='${data.overtime}'>
                </div>
              </div>
              <div class="row">
                <div class="form-group focused col-md-6">
                  <label>Break</label>
                  <input class="form-control" value='${data.breakTime}'>     
                </div>
                <div class="form-group focused col-md-6">
                  <label>Weekday</label>
                  <input class="form-control" value='${data.weekDay}'>
                </div>
              </div>
              <div class="form-group focused">
                <label>Comment</label>
                <textarea type="text" rows="1" class="form-control">${data.clientTimesheetInstruction}</textarea>
              </div>
              <div class="form-group">
                <input type="checkbox" id="md_checkbox_27" ${data.approved}>
                <label for="md_checkbox_27">Approved</label>
              </div>        
            </form>`;  
        let popupWin = window.open('', '_blank');

        popupWin.document.write(
          `<html>
           <head>
            <title>Timesheet</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <link rel="stylesheet" href="./assets/css/printTimesheet.css"/>
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
          </head><body>
          <div class="row">
          <div class="card" style="width:90%;margin:auto;"> 
            <h2 class="card-head" style="padding-left:1.25rem;">Timesheet</h2>
            <div class="card-body">`);
        popupWin.document.write(form);    
        popupWin.document.write(`</div></div></div></body></html>`);

        popupWin.document.close();
        $(popupWin.document).ready(()=>{
          popupWin.focus();
          popupWin.print();
          popupWin.close();
        });
    }


    /*********************Filter***********************/

    formateFilterData(data:AdminTimesheetFilter){
        let filter = new AdminTimesheetFilter();
        filter.task = this.checkEmpty(data.task);
        filter.employee = this.checkEmpty(data.employee);
        filter.client = this.checkEmpty(data.client);
        filter.order = this.checkEmpty(data.order);
        filter.approve = this.checkEmpty(data.approve);
        filter.project = this.checkEmpty(data.project);
        filter.startDate = this.checkEmpty(data.startDate);
        filter.endDate = this.checkEmpty(data.endDate);
        filter.startTime = this.checkEmpty(data.startTime);
        filter.endTime = this.checkEmpty(data.endTime);
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
                  let a = filter.task? this.checkTask(data,filter):true;
                  let b = filter.order? this.checkOrder(data,filter):true;
                  let c = filter.employee? this.checkEmployee(data,filter):true;
                  let d = filter.approve? this.checkApprove(data,filter):true;
                  let e = filter.client? this.checkClient(data,filter):true;
                  let f = filter.project? this.checkProject(data,filter):true;
                  let g = filter.startDate||filter.endDate? this.checkDate(data,filter):true;
                  let h = filter.startTime||filter.endTime? this.checkTime(data,filter):true;

                   if(a && b && c && d && e && f && g && h) 
                    filterData.push(data);
                }
                return filterData;
            } else return arr;
      }




      checkAllNull(f){
          if(f.task || f.client || f.project || f.order || f.employee || f.approve || f.startDate || 
            f.endDate || f.startTime || f.endTime) return true;
          else return false;
      }

      checkTask(data,filter){
        if(data.allocatedDates.employeeAllocation.task.id==filter.task) return true;
        return false;
      }
      checkProject(data,filter){
        if(data.allocatedDates.employeeAllocation.task.order.project.id==filter.project) return true;
        return false;
      }
      checkOrder(data,filter){
        if(data.allocatedDates.employeeAllocation.task.order.id==filter.order) return true;
        return false;
      }

      checkClient(data,filter){
        if(data.allocatedDates.employeeAllocation.task.order.project.client.id==filter.client) return true;
        return false;
      }

      checkApprove(data,filter){
        let nam = data.approved? 'YES':'NO';
        if(nam==filter.approve) return true;
        return false;
      }

      checkEmployee(data,filter){
        if(data.employee.id==filter.employee) return true;
        return false;
      }

      

      checkDate(data,filter){
          let start = this.toTimestamp(filter.startDate);
          let end = this.toTimestamp(filter.endDate) + 86340;
          let formDate = data.date.hasOwnProperty('timestamp')? data.date.timestamp:this.toTimestamp(data.date)+43120;

          if(filter.startDate!=null&&filter.endDate!=null){
              if(formDate>= start&& formDate<=end) return true;
              return false;

          } else if(filter.startDate!=null){
              if(formDate>= start) return true;
              return false;

          } else if(filter.endDate!=null){
              if(formDate<=end) return true;
              return false;

          }else return false;
      }

      toTimestamp(date){
        if(date!=null){
          let a;
          if(typeof date=='string') a =date+ ' 00:00';
            else a = date.year +'-'+date.month+'-'+date.day+ ' 00:00';
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
      }

      checkTime(data,filter){
          let start = this.timeToTimestamp(filter.startTime);
          let end = this.timeToTimestamp(filter.endTime);
          let formTime = data.startTime.hasOwnProperty('timestamp')? data.startTime.timestamp:this.timeToTimestamp(data.startTime);
          let toTime = data.finishTime.hasOwnProperty('timestamp')? data.finishTime.timestamp:this.timeToTimestamp(data.finishTime);

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

/******************CSV****************/

  checkWeek(alloDate,dates){
    let weekCount = 0;
    let ch = alloDate.hasOwnProperty('timestamp')? alloDate.timestamp:this.toTimestamp(alloDate);
    for(let i=0;i<dates.length-6;i=i+7){
      let d1 = this.toTimestamp(dates[i]);
      let d2 = this.toTimestamp(dates[i+6])?this.toTimestamp(dates[i+6]):this.toTimestamp(dates[dates.length-1]);
      weekCount++;
      if(ch>=d1 && ch<=(d2+86340)) return 'Week '+weekCount; 

    }
    
  }

  payRollJSONtoCSV(timesheetArray,dates){
    let data = [], ids= [];
    for(let allo of timesheetArray){
        let week = this.checkWeek(allo.date,dates);
        let index = this.findIndex(ids,allo,week);
        if(ids.length<1){
          let csv = this.initPayRoll(allo,week);
          ids.push(this.pushIds(allo,week));
          data.push(csv);
        } else {
          if(index>-1){
            let csv = data[index];
            if(allo.weekend=='No') {
              let over = 0;
              over = this.validationForm.getOvertime(allo.finishTime);
              csv.overtime += over;
              csv.totalTime.time += this.validationForm.getDefferenc(allo.startTime,allo.finishTime)-over;
              csv.totalTime.shift.push(this.validationForm.getShift(allo.startTime));
            } else {
              csv.weekend.time += this.validationForm.getDefferenc(allo.startTime,allo.finishTime);
              csv.weekend.shift.push(this.validationForm.getShift(allo.startTime));
              csv.weekend.day = allo.weekend;
            }
          } else {
            let csv = this.initPayRoll(allo,week);
            ids.push(this.pushIds(allo,week));
            data.push(csv);
          }
        }
    }
    return data;
  }


  initPayRoll(allo,week){
    let csv ={employee:{},week:week,totalTime:{time:0,shift:[]}, weekend:{time:0,shift:[],day:''}, overtime:0, task:{}};
    csv['employee'] = allo.employee;
    csv['task'] = allo.allocatedDates.employeeAllocation.task;
    if(allo.weekend=='No') {
      let over = 0;
      over = this.validationForm.getOvertime(allo.finishTime);
      csv.overtime += over;
      csv.totalTime.time += this.validationForm.getDefferenc(allo.startTime,allo.finishTime)-over;
      csv.totalTime.shift.push(this.validationForm.getShift(allo.startTime));
    } else {
      csv.weekend.time += this.validationForm.getDefferenc(allo.startTime,allo.finishTime);
      csv.weekend.shift.push(this.validationForm.getShift(allo.startTime));
      csv.weekend.day = allo.weekend;
    }
    return csv;
  }

  pushIds(allo,week){
    return {empId:allo.employee.id,tskId:allo.allocatedDates.employeeAllocation.task.id,week:week}
  }

  findIndex(arr,allo,week){
    let emp = allo.employee.id;
    let tsk = allo.allocatedDates.employeeAllocation.task.id;
    for(let i=0; i<arr.length;i++){
      if(arr[i].empId==emp && arr[i].tskId==tsk && arr[i].week==week) return i;
    }
    return -1;
  }

  formatPayRollCSV(formatedData){
    let data = [], clientList = ['Client List'];
    for(let csv of formatedData){
      let obj = {
        "Employee": csv.employee.user.firstName+ ' ' + csv.employee.user.lastName,
        "Base Rate": 20,
        "Company Worked": csv.task.order.project.client.companyName
      }
      if(csv.totalTime.time>0){
        obj['Hours'] = csv.totalTime.time.toFixed(2);
        obj['Pay Rate'] = csv.task.job[0].payscale;
        obj['Money'] = (parseFloat(obj['Hours']) * obj['Pay Rate']).toFixed(2);
        obj['Week'] = csv.week;
        obj['Comment'] = this.checkShift(csv.totalTime.shift)
        data.push(obj);
      }
      if(csv.overtime>0){
        obj['Hours'] = csv.overtime.toFixed(2);
        obj['Pay Rate'] = csv.task.job[0].payscale;
        obj['Money'] = (parseFloat(obj['Hours']) * obj['Pay Rate']).toFixed(2);
        obj['Week'] = csv.week;
        obj['Comment'] = 'Overtime';
        data.push(obj);
      }
      if(csv.weekend.time>0){
        obj['Hours'] = csv.weekend.time.toFixed(2);
        obj['Pay Rate'] = csv.task.job[0].payscale;
        obj['Money'] = (parseFloat(obj['Hours']) * obj['Pay Rate']).toFixed(2);
        obj['Week'] = csv.week;
        obj['Comment'] = csv.weekend.shift.includes('Night')? (csv.weekend.day+' Night'):csv.weekend.day;
        data.push(obj);
      }

     if(!clientList.includes('\n'+csv.task.order.project.client.companyName)) 
        clientList.push('\n'+csv.task.order.project.client.companyName); 
    }

    return {csv:data,client:clientList};
  }

  checkShift(data){
    let arr = [], d = 0, n =0;
    for (let i of data) {
      if(i=='Day') d++;
      else n++;
    }
    if(d&&n) return 'Day('+ d +' Night('+n+')'; 
    if(d) return 'Day'; 
    if(n) return 'Night'; 
  }

  /************clientWeek***************/

  convertJSONtoCSV(timesheetArray){
    let data = [], empIds= [];
    for(let allo of timesheetArray){
      if(empIds.length<1){
          let csv:CSVData ={employee: {},totalTime:0, jobDates:[]};
          let jobdate:JobDates = {date:{},totalTime:0};
          csv['employee'] = allo.employee;
          jobdate['date'] = this.validationForm.convertToCustomDate(allo.date);
          jobdate['totalTime'] = this.validationForm.getDefferenc(allo.startTime,allo.finishTime);
          csv['totalTime'] += jobdate['totalTime'];
          csv['jobDates'].push(jobdate);
          empIds.push(allo.employee.id);
          data.push(csv);
      } else {
        if(empIds.includes(allo.employee.id)){
            let jobdate:JobDates = {date:{},totalTime:0};
            let csv = data[empIds.indexOf(allo.employee.id)]
            jobdate['date'] = this.validationForm.convertToCustomDate(allo.date);
            jobdate['totalTime'] = this.validationForm.getDefferenc(allo.startTime,allo.finishTime);
            csv['totalTime'] += jobdate['totalTime'];
            csv['jobDates'].push(jobdate);
          } else {
            let csv:CSVData ={employee: {},totalTime:0, jobDates:[]};
            let jobdate:JobDates = {date:{},totalTime:0};
            csv['employee'] = allo.employee;
            jobdate['date'] = this.validationForm.convertToCustomDate(allo.date);
            jobdate['totalTime'] = this.validationForm.getDefferenc(allo.startTime,allo.finishTime);
            csv['totalTime'] += jobdate['totalTime'];
            csv['jobDates'].push(jobdate);
            empIds.push(allo.employee.id);
            data.push(csv);
          }
      }
    }
    return data;
  }


  formatCSVData(formatedData,dates){
    let data = []
    for(let csv of formatedData){
      let obj = {
        "Name": csv.employee.user.firstName + csv.employee.user.lastName,
        "Position": 'GL'
      }
      for(let d of dates){
        let ch = this.checkDateArray(csv.jobDates,d);
        let prop = this.getFormatedDate(d);
        if(ch!=null) obj[prop] = Number.isInteger(ch)? ch:parseFloat(ch.toFixed(2));
        else obj[prop] = '';
      }
      obj['Total'] =Number.isInteger(csv.totalTime)? csv.totalTime:parseFloat(csv.totalTime.toFixed(2));
      data.push(obj);
    }
    return data;
  }

  checkDateArray(arr,d){
    for(let i of arr){
      if(i.date.year==d.year&&i.date.month==d.month&&i.date.day==d.day) {
        return i.totalTime;
      }
    } 
    return null;
  }

  getFormatedDate(d){
    let date = this.validationForm.dateShow(d);
    let day = this.validationForm.getWeekDay(d).slice(0,3);
    return `${date}(${day})`;
  }

  formatTotal(arr){
    if(arr.length>0){
      let obj = {
        "Name": 'Total',
        "Position": ''
      }
      let keys = Object.keys(arr[0]);
      for(let k of keys){
       if(k!='Name' && k!='Position') obj[k] = 0;
      }
      for(let data of arr){
        for(let k in data){
          if(k!='Name' && k!='Position'){
            if(data[k]) { 
              obj[k] += data[k];
            } else obj[k] += 0;
          }
        }
      }
      arr.push(obj)
    }
    return arr;
  }
    
    


}