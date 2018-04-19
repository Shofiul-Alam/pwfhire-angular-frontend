import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from "../models/global";
import {TimesheetFilter} from "../models/timsheetFilter";
import {CustomDate} from '../models/customDate';



@Injectable()
export class EmployeeTimesheetService {
    public url:string;
    public identity;
    public token;

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

    getTimesheet(page) {
        let params = '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
        return this._http.post(this.url+'/employee-timesheet/list?page='+page+'&XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers}).map(res => res.json());
    }

    addTimesheet(sheet,pdf) {
        let json = JSON.stringify(sheet);
        let sheetUpload = JSON.stringify(pdf);
        let params = "json="+json +"&upload="+ sheetUpload +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-timesheet/add?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    updateTimesheet(sheet,pdf) {
        let json = JSON.stringify(sheet);
        let sheetUpload = JSON.stringify(pdf);
        let params = "json="+json +"&upload="+ sheetUpload +'&authorisation='+this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-timesheet/edit?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }

    archiveTimesheet(sheet) {
        let json = JSON.stringify(sheet);
        let params = "json="+json + '&authorisation='+ this.getToken();
        let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this._http.post(this.url+'/employee-timesheet/archive?XDEBUG_SESSION_START=PHPSTORM', params, {headers: headers})
            .map(res => res.json());
    }





    /*************Print Timesheet**************/

    convertTimesheetData(d){
        let data = JSON.parse(JSON.stringify(d));
        data.date = this.dateShow(d.date);
        if(data.startTime)
          data.startTime = (d.startTime.hour.toString().length == 1 ? "0" + d.startTime.hour : d.startTime.hour > 12 ? d.startTime.hour - 12: d.startTime.hour) + ":" +
                         (d.startTime.minute.toString().length == 1? "0" + d.startTime.minute: d.startTime.minute) +
                          (d.startTime.hour > 12 ? " PM" : " AM");
        if(data.finishTime)
          data.finishTime =   (d.finishTime.hour.toString().length == 1 ? "0" + d.finishTime.hour : d.finishTime.hour > 12 ? d.finishTime.hour - 12: d.finishTime.hour) + ":" +
                            (d.finishTime.minute.toString().length == 1? "0" + d.finishTime.minute: d.finishTime.minute) +
                            (d.finishTime.hour > 12 ? " PM" : " AM");
        data.allocatedDates = !d.allocatedDates? '':this.dateShow(d.allocatedDates.date);
        return data;
    }

    printTimesheet(data){

      if(data.approved) data.approved = 'checked';
      else data.approved = '';

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

    dateConversion(data){
        let a = new Date(data.timestamp * 1000);
        let year = a.getFullYear();
        let month = a.getMonth()+1;
        let day = a.getDate();
        let date = new CustomDate(year, month, day);
        return date;
    }

    dateShow(data){
        let newDate = new CustomDate();
        if(data != null){
            if(data.hasOwnProperty('timestamp')){
                newDate = this.dateConversion(data);
                let date = ((newDate.day.toLocaleString()).length==1? ('0'+newDate.day):newDate.day) +"-"
                    + ((newDate.month.toLocaleString()).length==1? ('0'+newDate.month):newDate.month)+"-"+newDate.year;
                return date;
            }else {
                let date = ((data.day.toLocaleString()).length==1? ('0'+data.day):data.day) +"-"
                + ((data.month.toLocaleString()).length==1? ('0'+data.month):data.month)+"-"+data.year;
                return date;
            }
        }
        return '';
    }

    findAllocatedDate(arr,id){
      let x=null;
      for(let i of arr){
        if(i.id==id){
          x=JSON.parse(JSON.stringify(i));
          delete x.text;
          return x;
        }
      }
      return x;
    }

    /*********************Filter***********************/

    formateFilterData(data:TimesheetFilter){
        let filter = new TimesheetFilter();
        filter.taskName = this.checkEmpty(data.taskName);
        filter.client = this.checkEmpty(data.client);
        filter.proAddress = this.checkEmpty(data.proAddress);
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
                  let a = filter.taskName? this.checkJob(data,filter):true;
                  let b = filter.client? this.checkClient(data,filter):true;
                  let c = filter.proAddress? this.checkAddress(data,filter):true;
                  let d = filter.startDate||filter.endDate? this.checkDate(data,filter):true;
                  let e = filter.startTime||filter.endTime? this.checkTime(data,filter):true;

                   if(a && b && c && d && e) 
                    filterData.push(data);
                }
                return filterData;
            } else return arr;
      }




      checkAllNull(f){
          if(f.taskName || f.client || f.proAddress || f.startDate || f.endDate || f.startTime || f.endTime) return true;
          else return false;
      }

      checkJob(data,filter){
        if(filter.taskName!=null){
            let taskName = data.allocatedDates.employeeAllocation.task.taskName.toUpperCase();
            let fil = filter.taskName.toUpperCase();
            if(taskName.indexOf(fil) > -1) return true;
        }
        return false;
      }

      checkClient(data,filter){
        if(filter.client!=null){
            let nam = data.allocatedDates.employeeAllocation.task.order.project.client.companyName.toUpperCase();
            let fil = filter.client.toUpperCase();
            if(nam.indexOf(fil) > -1) return true;
        }
        return false;
      }

      checkAddress(data,filter){
        if(filter.proAddress!=null){
            let nam = data.allocatedDates.employeeAllocation.task.order.project.projectAddress.toUpperCase();
            let fil = filter.proAddress.toUpperCase();
            if(nam.indexOf(fil) > -1) return true;
        }
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
              if(formDate.timestamp<=end) return true;
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


    

    

}